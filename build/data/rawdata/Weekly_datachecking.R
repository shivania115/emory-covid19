#####################       SETTING DIRECTORIES    ##########################


# - path where your file of interest is located on PC 
local = setwd("/Users/poojanaik/Downloads")


# box sync folder path 
#box = "/Users/poojanaik/Box Sync/COVID19_data_shared"
box = "/Users/starsdliu/Desktop/Rollins School of Public Health Research/Shivani - COVID-19/Dashboard/emory-covid19/public/data/rawdata"


#####################     LOADING REQUIRED PACKAGES     ###########################

if (!require("base")){
  install.packages("base")}
if (!require("arsenal")){
  install.packages("arsenal")}
if (!require("compareDF")){
  install.packages("compareDF")}
if (!require("cronR")){
  install.packages("cronR")}
if (!require("tidyverse")){
  install.packages("tidyverse")}
if (!require("tidyr")){
  install.packages("tidyr")}
if (!require("readr")){
  install.packages("readr")}
if (!require("dplyr")){
  install.packages("dplyr")}
if (!require("tibble")){
  install.packages("tibble")}
if (!require("lubridate")){
  install.packages("lubridate")}
if (!require("cronR")){
  install.packages("cronR")}
if (!require("compareDF")){
  install.packages("compareDF")}
if (!require("arsenal")){
  install.packages("arsenal")}
if (!require("magrittr")){
  install.packages("magrittr")}


library(base)
library(tidyverse)
library(tidyr)
library(readr)
library(dplyr)
library(tibble)
library(lubridate)
library(cronR)
library(compareDF)
library(arsenal)
library(magrittr)


# setting box directory
setwd(box)


# Reading our data 
our_raw <- read.csv("nationalraw.csv") %>% filter(!countycode=="",!date=="") %>% select(countycode,date,cases,deaths,date)
our_data <- transform(our_raw, date = as.Date(as.character(date), "%Y-%m-%d"))


# Reading NYT data 
nyt_dat <- readr::read_csv("https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv")
nyt_dat <- dplyr::rename(nyt_dat,countyname=county,statename=state,countycode=fips)
check_data <- nyt_dat %>% filter(date==max(our_data$date),!countycode=="") %>% select(countycode,date,cases,deaths,date)


# comparing our data with NYT data 
comp <- comparedf(check_data,our_data,by="countycode",int.as.num=TRUE)
comparedf(check_data,our_data,by="countycode",int.as.num=TRUE)
report <- diffs(comp)
head(diffs(comp))


# Creating report
report <- dplyr::rename(report,check_data_var=var.x,our_data_var=var.y,check_data_values=values.x,our_data_values=values.y,check_data_row=row.x,our_data_row=row.y)

report$check_data_values <- as.numeric(report$check_data_values)
report$our_data_values <- as.numeric(report$our_data_values)

diff_report <- report %>% 
  mutate(diff = check_data_values-our_data_values)


# Cases discrepancy summary report - will not give any result if there's no discrepancies
#DataUpdatedOn - causes error when no difference, hence locked
CaseData <- diff_report %>% filter(!diff == "0",our_data_var=="cases") %>% select(countycode,our_data_values,check_data_values,diff)
CaseData$LastCheckedOn <- Sys.Date()

htmlTable(CaseData,
          header = c("County code", "Our data", "NYT data", "Difference","Last checked on"),
          caption="Data Check report: Cases in the US at county level.",
          rnames=FALSE,
          tfoot = "&dagger; This report will be generated weekly and the date of check will be reflected in the 'Last checked on' column. The date in 'Data updated on' column reflects the date our nationalraw data was updated on." )



# Deaths discrepancy summary report - will not give any result if there's no discrepancies
DeathData <- diff_report %>% filter(!diff == "0",our_data_var=="deaths") %>% select(countycode,our_data_values,check_data_values,diff)
DeathData$LastCheckedOn <- Sys.Date()

htmlTable(DeathData,
          header = c("County code", "Our data", "NYT data", "Difference", "Last checked on"),
          caption="Data Check report: Deaths in the US at county level.",
          rnames=FALSE,
          tfoot = "&dagger; This report will be generated weekly and the date of check will be reflected in the 'Last checked on' column. The date in 'Data updated on' column reflects the date our nationalraw data was updated on." )



#########################    Exporting data to box     ###########################

setwd(box)

## MAC - Unlock the following code when ready to export by highlighting the lines and pressing Command + shift + C
## WINDOWS - Unlock the following code when ready to export by highlighting the lines and pressing Ctrl + shift + C

# write.csv(CaseData, "./Pooja/Weekly data checking/Cases discrepancy Report.csv", na="", row.names=FALSE)
# write.csv(DeathData, "./Pooja/Weekly data checking/Death discrepancy Report.csv", na="", row.names=FALSE)

##star
write.csv(CaseData, "../../../../../other tasks/Cases discrepancy Report.csv", na="", row.names=FALSE)
write.csv(DeathData, "../../../../../other tasks//Death discrepancy Report.csv", na="", row.names=FALSE)
