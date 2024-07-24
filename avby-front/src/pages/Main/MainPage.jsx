import "./MainPage.css";

// components
import TitleMainSection from "../../components/Title/Title";
import MainCarBlock from "../../components/CarsBlock/CarsBlock";

const title = "Главная страница";

export default function MainPage() {
  document.title = title;
  return (
    <div>
      <TitleMainSection />
      <MainCarBlock />
    </div>
  );
}
