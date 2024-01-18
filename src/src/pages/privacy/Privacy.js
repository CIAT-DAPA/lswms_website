import React from "react";
import { useTranslation } from "react-i18next";

function Privacy() {
  const [t] = useTranslation("global");
  return (
    <div className="container">
      <h1 className="pt-5">Privacy </h1>
      <p>
        We are representing the Alliance Bioversity International and CIAT and
        the Ethiopian Agricultural Research Institute in the Climate Action
        research program. We are developing a study of population living around
        water points in Ethiopia, the project aims to provide technology
        solutions to the people who may be affected by the different challenges
        at the water points. This study aims to collect data from these people
        in order to provide technological solutions such as text messages and
        emails when certain events occur at the water points to which they
        subscribe.
      </p>
      <p>
        You, as a local resident, have been selected to participate in this
        interview for the following purposes:
      </p>
      <ul>
        <li>To collect your demographic information</li>
        <li>To collect your personal information</li>
      </ul>
      <p>
        This is for the purpose of storing it in a database so that we can send
        constant updates when necessary. It is important to clarify here that:
      </p>
      <ol>
        <li>
          All information collected is confidential and will only be analyzed by
          researchers from the Alliance Bioversity International and CIAT and
          the Ethiopian Agricultural Research Institute. Because of its
          confidential nature, participating in this research anonymously will
          avoid any perceived risk of sharing your experiences and impressions
          of the program to be evaluated. Such confidentiality will also ensure
          that, except for the learning gained from your own and shared
          reflection of your participation in the Livesock Surface monitoring
          system, you will not be exposed to any risk.
        </li>
        <li>
          This study will maintain the absolute confidentiality of your identity
          and will use the data obtained only for professional purposes,
          encrypting the information, and keeping it in secure files. Only
          researchers will have access to this information. In no case will
          individual persons be identified. If you have questions about the
          handling of your information regarding this study, you may (also)
          contact Sintayehu Alemayehu (s.alemayehu@cgiar.org).
        </li>
        <li>
          The information you provide will be used exclusively for research
          purposes.
        </li>
        <li>
          You may withdraw or abstain from the interview at any time. We respect
          your right not to respond to them.
        </li>
        <li>
          If direct quotations are to be used in reports of results and/or
          publications, they will be used with the prior consent of the
          interviewee.
        </li>
        <li>
          During the interview, your name, phone number, email and location will
          be collected due to the remote nature of the interview.
        </li>
        <li>
          By signing/accepting this agreement, you acknowledge that you have
          been informed of the purpose of this study and agree to the above and
          give your consent to participate in this study.
        </li>
      </ol>
    </div>
  );
}

export default Privacy;
