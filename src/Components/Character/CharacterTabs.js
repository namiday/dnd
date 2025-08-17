import {
  Tab,
  Tabs,
  TabList,
  TabPanel
} from "react-tabs";
import "react-tabs/style/react-tabs.css";

import GeneralInfoTab from "./GeneralInfoTab";
import SkillsTab from "./Skills/SkillTabs";
import ObjectsTab from "./Objects/ObjectsTab";
import PnjsTab from "./PnjFamiliers/PnjsTab";
import ContactsTab from "./Contacts/ContactsTab";
import ExportButton from "../ExportButton";
import ImportButton from "../ImportButton";


export default function CharacterTabs() {
  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Tabs>
        <TabList>
          <Tab>Info. Générales</Tab>
          <Tab>Compétences</Tab>
          <Tab>Objets</Tab>
          <Tab>Familiers</Tab>
          <Tab>Contacts</Tab>
        </TabList>

        <TabPanel forceRender>
          <GeneralInfoTab />
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

      {/* Export CSV en bas de page */}
      <div className="flex justify-end mt-6">
        <ExportButton />
        <ImportButton />
      </div>
    </div>
  );
}
