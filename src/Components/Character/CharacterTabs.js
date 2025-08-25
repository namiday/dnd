import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

import GeneralInfoTab from "./GeneralInfoTab";
import SkillsTab from "./Skills/SkillTabs";
import ObjectsTab from "./Objects/ObjectsTab";
import PnjsTab from "./PnjFamiliers/PnjsTab";
import ContactsTab from "./Contacts/ContactsTab";
import ExportButton from "../ExportButton";
import ImportButton from "../ImportButton";

function CharacterTabs({ level }) {
  const [generalInfo, setGeneralInfo] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("character_generalInfo")) || {};
    } catch {
      return {};
    }
  });

  return (
    <div className="p-4">
      <Tabs>
        <TabList>
          <Tab>Informations Générales</Tab>
          <Tab>Compétences</Tab>
          <Tab>Objets</Tab>
          <Tab>PNJ / Familiers</Tab>
          <Tab>Contacts</Tab>
        </TabList>

        <TabPanel forceRender>
          <GeneralInfoTab onInfoChange={setGeneralInfo} />
        </TabPanel>

        <TabPanel forceRender>
          <SkillsTab />
        </TabPanel>

        <TabPanel forceRender>
          <ObjectsTab />
        </TabPanel>

        <TabPanel forceRender>
          <PnjsTab />
        </TabPanel>

        <TabPanel forceRender>
          <ContactsTab />
        </TabPanel>
      </Tabs>

      <div className="flex justify-end gap-2 mt-6">
        <ExportButton level={level} generalInfo={generalInfo} />
        <ImportButton />
      </div>
    </div>
  );
}

export default CharacterTabs;
