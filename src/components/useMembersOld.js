import { members } from "../stitch";
import _ from 'lodash';

export const loadMembers = async () => {

  let memberDetails = await members.find({}).asArray();
  const today = new Date();
  //const monthAgo = new Date(new Date().getTime() - 30*24*60*60*1000);

  let bwDatesAll = []; // body weight
  let bpDatesAll = []; // blood pressure
  let auDatesAll = []; // active user

  _.forEach(memberDetails, function(d){

    const bwDates = _.map(d.bodyWeightData, x => x.time.substring(0,10));
    const bpDates = _.map(d.systolicBPData, x => x.time.substring(0,10));
    const auDates = _.union(_.concat(bwDates, bpDates));

    bwDatesAll = _.concat(bwDatesAll, bwDates);
    bpDatesAll = _.concat(bpDatesAll, bpDates);
    auDatesAll = _.concat(auDatesAll, auDates);

    d.dob = new Date(d.dob);
    d.age = Math.round((today.getTime() - d.dob.getTime()) / 31536000000);

    if (d.bodyWeightData.length > 0){
      d.bodyWeightLastDT = _.takeRight(d.bodyWeightData, 1)[0].time; // DT: Datetime
      d.bodyWeightSLData = _.map(d.bodyWeightData, x => x.value);
      d.bodyWeight = Math.round(_.takeRight(d.bodyWeightSLData, 1)[0]*100)/100;
      d.bodyWeightDiff = Math.round((d.bodyWeight - d.bodyWeightSLData[0])*100)/100;
    } else {
      d.bodyWeightLastDT = '1970-01-01';
    }


    if (d.systolicBPData.length > 0){
      d.systolicBP = Math.round(_.takeRight(d.systolicBPData, 1)[0].value*100)/100;
      d.systolicBPLast = _.takeRight(d.systolicBPData, 1)[0];
      d.systolicBPLastDT = d.systolicBPLast.time;      
      d.systolicBPSLData = _.map(d.systolicBPData, x => x.value);
      d.systolicBPDiff = Math.round((d.systolicBP - d.systolicBPSLData[0])*100)/100;
    } else {
      d.systolicBPLastDT = '1970-01-01';
    }

    if (d.diastolicBPData.length > 0){
      d.diastolicBP = Math.round(_.takeRight(d.diastolicBPData, 1)[0].value*100)/100;
      d.diastolicBPLast = _.takeRight(d.diastolicBPData, 1)[0];
      d.diastolicBPLastDT = d.diastolicBPLast.time;      
      d.diastolicBPSLData = _.map(d.diastolicBPData, x => x.value);
      d.diastolicBPDiff = Math.round((d.diastolicBP - d.diastolicBPSLData[0])*100)/100;
    } else {
      d.diastolicBPLastDT = '1970-01-01';
    }    

    if (d.noteData.length > 0) {
      d.latestNoteDT = _.takeRight(d.noteData, 1)[0].time;
      d.latestNote = _.takeRight(d.noteData, 1)[0].value;
      d.noteData = d.noteData.reverse();
    } else {
      d.latestNoteDT = '1970-01-01';
    }

    // number of unread messages
    if (d.messageData.length > 0){
      d.messageData = d.messageData.reverse();
    }
    d.numUnreadMessages = d.messageData.length - _.sumBy(d.messageData, 'isRead');
    
    // BP Alerts; need to be defined by Users (TODO)
    d.hypertensionAlert = false;
    d.hypotensionAlert = false;
    if (d.systolicBPLast){
      if (d.systolicBPLast.value > 180  || d.diastolicBPLast > 120){ 
        d.hypertensionAlert = true;
      }
      if (d.systolicBPLast.value < 90 || d.diastolicBPLast < 60){ 
        d.hypotensionAlert = true;
      }
    }



  });

  memberDetails = _.sortBy(memberDetails, 'latestNoteDT').reverse();

  let bwCounts = _.sortBy(_.map(_.countBy(bwDatesAll), (value, time) => ({time, value})), 'time');
  let bpCounts = _.sortBy(_.map(_.countBy(bpDatesAll), (value, time) => ({time, value})), 'time');
  let auCounts = _.sortBy(_.map(_.countBy(auDatesAll), (value, time) => ({time, value})), 'time');    

  let bwStats = _.meanBy(_.takeRight(bwCounts, 30), 'value');
  let bpStats = _.meanBy(_.takeRight(bpCounts, 30), 'value');
  let auStats = _.meanBy(_.takeRight(auCounts, 30), 'value');



  return {members: memberDetails, 
          stats: {
            au: auStats, 
            bw: bwStats, 
            bp: bpStats},
          counts: {
            au: auCounts, 
            bw: bwCounts, 
            bp: bpCounts},            
          };
}

export const updateNote = (selectedMemberPhone, noteValue, time, currentUserName, currentUserEmail) => {

  const item = {"time": time,
                  "by": currentUserName,
                  "email": currentUserEmail,
                  "value": noteValue};
  members.findOneAndUpdate({"phone": selectedMemberPhone},
    {"$push": {"noteData": item}})
    .then(updatedDocument => {
      if (updatedDocument){
        console.log(`Successfully updated document: ${updatedDocument}.`);
      }else{
        console.log('No document matches the provided query.');
      }
    })
    .catch(err => console.error(`Failed to find and update document: ${err}`))
    
}

export const updateNewMessage = (selectedMemberPhone, messageValue, time, currentUserName, currentUserEmail) => {

  const item = {"time": time,
                  "by": currentUserName,
                  "email": currentUserEmail,
                  "value": messageValue,
                  "isRead": true};
  members.findOneAndUpdate({"phone": selectedMemberPhone},
    {"$push": {"messageData": item}})
    .then(updatedDocument => {
      if (updatedDocument){
        console.log(`Successfully updated document: ${updatedDocument}.`);
      }else{
        console.log('No document matches the provided query.');
      }
    })
    .catch(err => console.error(`Failed to find and update document: ${err}`))

}

export const updateMessageRead = (selectedMemberPhone) => {

  members.findOneAndUpdate({"phone": selectedMemberPhone},
    {"$set": {"messageData.$[].isRead": true}})
    .then(updatedDocument => {
      if (updatedDocument){
        console.log(`Successfully updated document: ${updatedDocument}.`);
      }else{
        console.log('No document matches the provided query.');
      }
    })
    .catch(err => console.error(`Failed to find and update document: ${err}`))
}

