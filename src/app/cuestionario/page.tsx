"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Autosuggest from "react-autosuggest";
import Swal from "sweetalert2";

interface Cards {
    id: number;
    horas: number;
    comentarios: string | null;
    cursos: string | null;
    predico: boolean;
    auxiliar: boolean;
    createdAt: string;
    userId: number;

    user: {
        id: number;
        fullName: string;
        date_of_birth: string;
        date_of_baptism: string;
        esperanza: string;
        anciano: boolean;
        siervo_ministerial: boolean;
        genero: string;
        precursorado: string;
        createdAt: string;
        updatedAt: string;
    };
}


type Card = {
    nombre: string;
    predico: boolean;
    horas: string;
    auxiliar: boolean;
    comentarios: string;
    cursos: string;
}

const FormLayout = () => {

    const [horas, setHoras] = useState('');
    const [comentarios, setComentarios] = useState('');
    const [cursos, setCursos] = useState('');
    const [predico, setPredico] = useState(false);
    const [auxiliar, setAuxiliar] = useState(false);
    const [showHours, setShowHours] = useState(false);
    const [users, setUsers] = useState<{fullName: string, id: string}[]>([]);
    const [suggestions, setSuggestions] = useState<{fullName: string, id: string}[]>([]);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        fetch("http://localhost:8000/users")
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data: {fullName: string, id: string}[]) => {
                const newUsers = data
                    .filter(user => user.hasOwnProperty('fullName') && user.hasOwnProperty('id'));
                setUsers(newUsers);
            })
            .catch(error => {
                console.log('There was a problem with the fetch operation: ' + error.message);
            });
    }, []);

    const handleAuxiliarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setAuxiliar(isChecked);
        setShowHours(isChecked); // Muestra el campo de entrada de horas si 'auxiliar' está marcado
    };

    const getSuggestions = (value: string) => {
        const inputValue = value.trim().toLowerCase();

        return inputValue.length === 0 ? [] : users.filter(user =>
            user.fullName.toLowerCase().includes(inputValue)
        ).slice(0, 5); // Limita las sugerencias a las primeras 5
    };

    const onSuggestionsFetchRequested = ({ value }: any) => {
        setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
        setSuggestions([]);
    };

    const onSuggestionSelected = (event: any, { suggestion }: any) => {

        if (suggestion.precursorado === 'Regular') { // Verifica si el usuario tiene la propiedad "Regular" en "precursorado"
            setShowHours(true); // Muestra el input de horas
        } else {
            setShowHours(false); // Oculta el input de horas
        }
    };

    const onChange = (event: any, { newValue }: any) => {
        setValue(newValue);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const user = users.find(user => user.fullName === value);

        if (user) {

            const response2 = await fetch('http://localhost:8000/cards');
            const allCards = await response2.json();

// 2. Filtra las tarjetas obtenidas por userId
            const userCards = allCards.filter((card: Cards) => card.userId === Number(user.id));
// 3. Filtra las tarjetas del usuario específico por el mes actual
            const currentDate = new Date();
            const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript comienzan en 0
            const currentMonthCards = userCards.filter((card: Cards) => {
                const cardDate = new Date(card.createdAt);
                return cardDate.getMonth() + 1 === currentMonth;
            });

            if (currentMonthCards.length >= 1) {
                console.log('Ya se ha enviado una tarjeta este mes');
                Swal.fire('¡Ooops!', 'Ya se ha enviado una tarjeta este mes!', 'error');
                return;
            }

            const createCardDto = {
                horas: horas ? Number(horas) : null,
                comentarios: comentarios,
                cursos: cursos ? Number(cursos) : null,
                predico: predico,
                auxiliar: auxiliar,
                userId: Number(user.id)
            };

            const response = await fetch('http://localhost:8000/cards', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(createCardDto)
            });

            if (!response.ok) {
                console.log('Hubo un problema con la petición POST: ' + response.status);
            } else {
                console.log('Datos enviados correctamente');
                Swal.fire('¡Buen trabajo!', '¡Los datos se enviaron correctamente!', 'success');
            }
        } else {
            console.log('User not found');
            setError('Poner el nombre completo sugerido');
            Swal.fire('¡Ooops!', 'El nombre no se encontro!', 'error');

        }
    };

    const inputProps = {
        placeholder: 'Escribe tu nombre completo',
        value,
        onChange: onChange
    };


    return (

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1 ">
                <div className="flex flex-col gap-9 md:w-1/2">
                    {/* <!-- Contact Form --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Informe de Servicio
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6.5">
                                <div className="mb-4.5 ">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Nombre completo
                                    </label>
                                    <Autosuggest
                                        suggestions={suggestions}
                                        onSuggestionSelected={onSuggestionSelected}
                                        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
                                        onSuggestionsClearRequested={onSuggestionsClearRequested}
                                        getSuggestionValue={(suggestion) => suggestion.fullName}
                                        renderSuggestion={(suggestion) => <div>{suggestion.fullName}</div>}
                                        inputProps={inputProps}
                                        theme={{
                                            input: "w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary",
                                            suggestionsContainer: "absolute z-50  w-full",
                                            suggestionsList: "bg-white",
                                            suggestion: "py-2"
                                        }}
                                    />
                                    {error && <div style={{ color: 'red' }}>{error}</div>}


                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        ¿Cuantos cursos bíblicos dirigio este mes?
                                    </label>
                                    <input
                                        type="number"
                                        onChange={(e) => setCursos(e.target.value)}
                                        placeholder="Cursos Bíblicos"
                                        value={cursos}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <div className="mb-4.5">
                                        <div className="max-w">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={predico}
                                                    onChange={(e) => setPredico(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700 w-max">
                                                    Participó en el mes en algún rango de servicio
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="mb-4.5 ">
                                        <div className="max-w">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={auxiliar}
                                                    onChange={handleAuxiliarChange}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700 w-max">
                                                    Participó en como precursor auxiliar este mes
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {showHours && (
                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            ¿Cuantas horas participo en el servicio?
                                        </label>
                                        <input
                                            type="number"
                                            value={horas}
                                            onChange={(e) => setHoras(e.target.value)}
                                            placeholder="Horas de Servicio"
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                )}

                                <div className="mb-6">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Comentarios
                                    </label>
                                    <textarea
                                        rows={3}
                                        placeholder="Comentarios"
                                        value={comentarios}
                                        onChange={(e) => setComentarios(e.target.value)}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    ></textarea>
                                </div>


                                <button
                                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray hover:bg-opacity-90">
                                    Subir
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
    );
};

export default FormLayout;