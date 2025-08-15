import {
  Tab,
  Tabs,
  TabList,
  TabPanel
} from "react-tabs";
import "react-tabs/style/react-tabs.css"; // styles de base, à personnaliser si besoin
import ObjetVehiculeForm from "./ObjetVehiculeForm";

export default function CharacterTabs() {
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Tabs>
        <TabList>
          <Tab>Info. Générales</Tab>
          <Tab>Compétences</Tab>
          <Tab>Objets</Tab>
          <Tab>Familiers</Tab>
          <Tab>Contacts</Tab>
        </TabList>

        <TabPanel>
          <div>À venir : Info. Générales</div>
        </TabPanel>
        <TabPanel>
          <div>À venir : Compétences</div>
        </TabPanel>
        <TabPanel>
          <ObjetVehiculeForm/>
        </TabPanel>
        <TabPanel>
          <div>À venir : Familiers</div>
        </TabPanel>
        <TabPanel>
          <div>À venir : Contacts</div>
        </TabPanel>
      </Tabs>
    </div>
  );
}
