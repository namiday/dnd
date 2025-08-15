import {
  Tab,
  Tabs,
  TabList,
  TabPanel
} from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ObjetVehiculeForm from "./../ObjetVehiculeForm";
import GeneralInfoTab from "./GeneralInfoTab";
import SkillsTab from "./Skills/SkillTabs";
import ObjectsTab from "./Objects/ObjectsTab";
import PnjsTab from "./PnjFamiliers/PnjsTab";
import ContactsTab from "./Contacts/ContactsTab";



export default function CharacterTabs() {
  return (
    <div className="w-full max-w-4xl mx-auto">
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
    </div>
  );
}
