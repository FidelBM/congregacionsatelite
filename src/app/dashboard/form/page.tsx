"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import axios from 'axios';
import React, { useState } from 'react';
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const FormLayout = () => {

    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfBaptism, setDateOfBaptism] = useState('');
    const [esperanza, setEsperanza] = useState('');
    const [anciano, setAnciano] = useState(false);
    const [siervoMinisterial, setSiervoMinisterial] = useState(false);
    const [genero, setGenero] = useState('');
    const [precursorado, setPrecursorado] = useState('');



    const [hombre, setHombre] = useState(false);
    const [mujer, setMujer] = useState(false);
    const [otrasOvejas, setOtrasOvejas] = useState(false);
    const [ungido, setUngido] = useState(false);
    const [regular, setRegular] = useState(false);
    const [especial, setEspecial] = useState(false);
    const [misionero, setMisionero] = useState(false);


    React.useEffect(() => {
        if (hombre) {
            setGenero('Hombre');
        } else if (mujer) {
            setGenero('Mujer');
        }
    }, [hombre, mujer]);

    React.useEffect(() => {
        if (otrasOvejas) {
            setEsperanza('Otras Ovejas');
        } else if (ungido) {
            setEsperanza('Ungido');
        }
    }, [otrasOvejas, ungido]);

    React.useEffect(() => {
        if (regular) {
            setPrecursorado('Precursor Regular');
        } else if (especial) {
            setPrecursorado('Precursor Especial');
        } else if (misionero) {
            setPrecursorado('Misionero');
        }
    }, [regular, especial, misionero]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();


        const createUserDto = {
            fullName,
            date_of_birth: new Date(dateOfBirth),
            date_of_baptism: new Date(dateOfBaptism),
            esperanza,
            anciano,
            siervo_ministerial: siervoMinisterial,
            genero,
            precursorado,
        };

        try {
            const response = await axios.post(`https://cardsbackend-production-f527.up.railway.app/users`, createUserDto);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DefaultLayout>
            <Breadcrumb pageName="Formulario" />

            <div className="grid grid-cols-1 gap-9 sm:grid-cols-1">
                <div className="flex flex-col gap-9">
                    {/* <!-- Contact Form --> */}
                    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                        <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                            <h3 className="font-medium text-black dark:text-white">
                                Tarjeta de Hermanos
                            </h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="p-6.5">
                                <div className="mb-4.5 flex flex-col gap-6 ">
                                    <div className="w-full xl:w-1/2">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            Nombre completo
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Ingresa el nombre"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Fecha de Nacimiento
                                    </label>
                                    <input
                                        type="date"
                                        value={dateOfBirth}
                                        onChange={(e) => setDateOfBirth(e.target.value)}
                                        placeholder="Enter your email address"
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Fecha de Bautismo
                                    </label>
                                    <input
                                        type="Date"
                                        onChange={(e) => setDateOfBaptism(e.target.value)}
                                        placeholder="Select subject"
                                        value={dateOfBaptism}
                                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                    />
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Género
                                    </label>
                                    <div className="mb-4.5 grid grid-cols-3 gap-4">
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={hombre}
                                                    onChange={(e) => setHombre(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Hombre
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={mujer}
                                                    onChange={(e) => setMujer(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Mujer
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Esperanza
                                    </label>
                                    <div className="mb-4.5 grid grid-cols-3 gap-4">
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={otrasOvejas}
                                                    onChange={(e) => setOtrasOvejas(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Otras Ovejas
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={ungido}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                    onChange={(e) => setUngido(e.target.checked)}
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Ungido
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Nombramiento
                                    </label>
                                    <div className="mb-4.5 grid grid-cols-3 gap-4">
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={anciano}
                                                    onChange={(e) => setAnciano(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Anciano
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={siervoMinisterial}
                                                    onChange={(e) => setSiervoMinisterial(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Siervo Ministerial
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Faceta de servicio
                                    </label>
                                    <div className="mb-4.5 grid grid-cols-3 gap-4">
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={regular}
                                                    onChange={(e) => setRegular(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Precursor Regular
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={especial}
                                                    onChange={(e) => setEspecial(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Precursor Especial
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="checkbox"
                                                    type="checkbox"
                                                    checked={misionero}
                                                    onChange={(e) => setMisionero(e.target.checked)}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="checkbox" className="text-gray-700">
                                                    Misionero
                                                </label>
                                            </div>
                                        </div>
                                    </div>
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
        </DefaultLayout>
    );
};

export default FormLayout;
