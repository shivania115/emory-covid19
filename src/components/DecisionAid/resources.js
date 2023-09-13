import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { TRANSLATIONS_SPAN } from "./span/translation";
import { TRANSLATIONS_EN } from "./en/translation";
import snarkdown from "snarkdown";
import {
    Container,
    Breadcrumb,
    Dropdown,
    Header,
    Grid,
    Progress,
    Loader,
    Divider,
    Popup,
    Table,
    Button,
    Image,
    Rail,
    Sticky,
    Ref,
    Segment,
    Accordion,
    Icon,
    Checkbox,
    Menu,
    Message,
    Transition,
    List,
} from "semantic-ui-react";
import React, {
    useEffect,
    useState,
    useRef,
    createRef,
    PureComponent,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        resources: {
            en: {
                translation: TRANSLATIONS_EN,
            },
            span: {
                translation: TRANSLATIONS_SPAN,
            },
        },
    });


function Resources() {
    const { t } = useTranslation();
    return (
        <div>
            <Header as="h4" style={{ paddingTop: 10, fontWeight: 550, fontSize: "1.5rem" }}>
                <Header.Content>
                    {t('step5_resources')}
                </Header.Content>
            </Header>
            <ul style={{ fontSize: '1.25rem', paddingTop: 5, paddingLeft: 0 }}>
                <li dangerouslySetInnerHTML={{ __html: snarkdown(t('step5_bullet1')) }}></li>
                <li dangerouslySetInnerHTML={{ __html: snarkdown(t('step5_bullet2')) }}></li>
                <li dangerouslySetInnerHTML={{ __html: snarkdown(t('step5_bullet3')) }}></li>
                <li dangerouslySetInnerHTML={{ __html: snarkdown(t('step5_acknowledgement')) }}></li>
            </ul>
            <ToastContainer />
        </div>
    );
}
export default Resources;