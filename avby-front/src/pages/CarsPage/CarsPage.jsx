import { MainCarBlock, TitleMainSection } from "../Main/MainPage"
import { useParams } from "react-router-dom"

function TitlePage({brand, model}) {
    brand = brand || ''
    model = model || ''
    return "Купить " + `${brand} ${model}`.toUpperCase()
}

export default function CarsPage() {
    const {brand, model} = useParams()
    const filters = {brand, model}


    document.title = TitlePage({brand, model})

    return (
        <>
        <TitleMainSection />
        <MainCarBlock showAll={true}  filters={filters}/>    
        </>
    ) 
}