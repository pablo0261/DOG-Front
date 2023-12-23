import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllDogs,
  orderDogs,
  filterByW,
  filterDogsByTemp,
  getAllTemperaments,
  filterOriginDog,
} from "../../Redux/Actions";
import "./Home.style.css";
import NavBar from "../../NavBar/NavBar.component";
import Dogs from "../../Dogs/Dogs"
import Paginate from "../../Pagination/Pagination";
import Cards from "../../Cards/Cards.component";
import fondo1 from '../../Utils/TituloBreedFinder.png';

function Home() {
  console.log("Renderizando Home");
  const [filtered, setFiltered] = useState(""); //* contiene el resultado de la busqueda de search
  
  const [searchString, setSearchString] = useState(""); //*contiene lo que se escribe en el search
  const [selectedTemperaments, setSelectedTemperaments] = useState([]); //*estado para mostrar los temp seleccionados
  // const [originalAllDogs, setOriginalAllDogs] = useState([]);//*para manejar allDogs y no perder su info original

  const dispatch = useDispatch();
  const allDogs = useSelector((state) => state.allDogs);
  const createDogs = useSelector((state) => state.createDogs);//! este rcreo que solo lo usa form
  const temperaments = useSelector((state) => state.allTemperaments);
  let dogSelected = useSelector((state) => state.dogSelected);
  let errorMessage = "";//! ver si lo necesito aqui

  useEffect(() => {
    console.log("Obteniendo todos los perros");
    dispatch(getAllDogs());
    dispatch(getAllTemperaments());
  }, [dispatch]);
  
//! nuevo intento de filtros combinados//
const filterByTemp = useSelector((state) => state.filterByTemp);
const flagFilterByTemp = useSelector((state) => state.flagFilterByTemp);
const filterByOrigin = useSelector((state) => state.filterByOrigin);
const flagFilterByOrigin = useSelector((state) => state.flagFilterByOrigin);

const copy1 = allDogs;


if (flagFilterByTemp && flagFilterByOrigin) {
  dogSelected = filterByOrigin.filter(dog => filterByTemp.includes(dog.name));
} else if (flagFilterByTemp) {
  dogSelected = filterByTemp.filter(dog => copy1.some(copyDog => copyDog.name === dog.name));
} else if (flagFilterByOrigin) {
  dogSelected = filterByOrigin.filter(dog => copy1.some(copyDog => copyDog.name === dog.name));
} else {
  dogSelected = copy1; 
}

console.log("Valor actual de copy1:", copy1);
console.log("Valor actual de dogSelected:", dogSelected);
console.log("Valor actual de flagFilterByOrigin:", flagFilterByOrigin);
console.log("Valor actual de filterByOrigin:", filterByOrigin);
console.log("Valor actual de flagFilterByTemp:", flagFilterByTemp);
console.log("Valor actual de filterByTemp:", filterByTemp);

// Verificar si los arrays están vacíos
// console.log("¿filterByOrigin está vacío?", filterByOrigin.length === 0);
// console.log("¿filterByTemp está vacío?", filterByTemp.length === 0);

//! nuevo intento de filtros combinados//

  //* --- PAGINADO---//
  const [currentPage, setCurrentPage] = useState(1);
  const [dogsPerPage] = useState(8);
  const [pageLimit, setPageLimit] = useState(1);
  const indexPageFirstDog = currentPage * dogsPerPage;
  const indexFirstDog = indexPageFirstDog - dogsPerPage;
  const currentDogs = dogSelected.slice(indexFirstDog, indexPageFirstDog);
  const pageNumbers = Math.ceil(dogSelected.length / dogsPerPage);

  const paginado = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    setCurrentPage((page) => page + 1);
  };

  const previousPage = () => {
    setCurrentPage((page) => page - 1);
  };

  const getPages = () => {
    const start = Math.max(currentPage - Math.floor(pageLimit / 2), 1);
    return new Array(Math.min(pageNumbers, pageLimit))
      .fill()
      .map((_, i) => start + i);
  };
  //* --- PAGINADO---//

  

  const resetAll = (e) => {
    e.preventDefault();
    console.log("Obteniendo todos los perros");
    dispatch(getAllDogs());
    dispatch(getAllTemperaments());
  };

  const handleChange = (e) => {
    setSearchString(e.target.value);
    // console.log("searchString:", e.target.value);
  };

  const handleSubmit = (e) => {
    //*Filtro x nombre
    setCurrentPage(1);
    // console.log("searchString:", searchString);
    e.preventDefault();
    try {
      const filteredDogs = allDogs.filter((dog) =>
        dog.name.toLowerCase().includes(searchString.toLowerCase())
      );
      if (filteredDogs.length === 0) {
        throw new Error("No dog breeds found with that name.");
      }
      if (searchString.trim() === "") {
        setFiltered("");
      } else {
        setFiltered(filteredDogs);
      }
    } catch (error) {
      console.error(error.message);
      setFiltered("");
    }
  };

  const handleOrder = (e) => {
    //*Orden alfabetico dogs

    dispatch(orderDogs(e.target.value));
    // setOrden(`Ordenado ${e.target.value}`)
    setCurrentPage(1);
  };

  const handlerFilterW = (e) => {
    //*Orden x peso dogs
    dispatch(filterByW(e.target.value));
    // setOrden(`Ordenado ${e.target.value}`)
    setCurrentPage(1);
  };

  const handlerFilterOrigin = (e) => {
    //* Filtro x origen
    dispatch(filterOriginDog(e.target.value));
    setCurrentPage(1);
  };


  useEffect(() => {
    // Función para manejar el filtrado cuando selectedTemperaments cambia
    console.log("Filtros aplicados:");
  console.log("selectedTemperaments:", selectedTemperaments);
  console.log("filterByTemp:", filterByTemp);
  console.log("flagFilterByTemp:", flagFilterByTemp);
    const handlefilterByTemp = () => {
      dispatch(filterByTemp(selectedTemperaments));
    };

    // Ejecutar la función de filtrado cuando selectedTemperaments cambia
    if (typeof filterByTemp === 'function') {
      handlefilterByTemp();
    }
  }, [selectedTemperaments, filterByTemp]);

  const handlerFilterTemp = (e) => {
    e.preventDefault();
    const selectedTemp = e.target.value;
    setCurrentPage(1);
    if (!selectedTemperaments.includes(selectedTemp)) {
      // Actualiza el estado de los temperamentos seleccionados
      setSelectedTemperaments([...selectedTemperaments, selectedTemp]);
    }
    // console.log(selectedTemperaments)
    dispatch(filterDogsByTemp(selectedTemperaments));
  };

  const handleRemoveTemperament = (deleteTemp) => {
    const updatedTemperaments = selectedTemperaments.filter(
      (temp) => temp !== deleteTemp
    );
    setSelectedTemperaments(updatedTemperaments);
    dispatch(filterDogsByTemp(updatedTemperaments));
  };


  return (
    <div className="Home">
      <div className="HomeContainerTitle">
        <div >
        <img src={fondo1} className="HomeTitle" alt="Add Breeds" />
        </div>
      </div>

      <NavBar
        paginado={paginado}
        handleChange={handleChange}//!CREO QUE NO LO ESTA USANDO
        handleSubmit={handleSubmit}//!CREO QUE NO LO ESTA USANDO
      />
      {errorMessage && <p className="ErrorMessage">{errorMessage}</p>}
      {allDogs.length ? (
        <div>
          <Dogs
            handleOrder={handleOrder}
            handlerFilterW={handlerFilterW}
            handlerFilterOrigin={handlerFilterOrigin}
            handlerFilterTemp={handlerFilterTemp}
            temperaments={temperaments}
            handleRemoveTemperament={handleRemoveTemperament}
            selectedTemperaments={selectedTemperaments}
            resetAll = {resetAll}
          />
          {dogSelected.notFound ? (
            <p className="NotFoundMessage">No dogs were found with those temperaments</p>
          ) : (
            <Cards AllDogs={currentDogs} className="HomeCards"/>
          )}
          <Paginate
            pageNumbers={pageNumbers}
            getPages={getPages}
            currentPage={currentPage}
            nextPage={nextPage}
            previousPage={previousPage}
            dogsPerPage={dogsPerPage}
            dogsResult={dogSelected.length}
            paginado={paginado}
          />
        </div>
      ) : (
        <div className="divLoading">
          <h1>LOADING...</h1>
        </div>
      )}
    </div>
  );
}

export default Home;
