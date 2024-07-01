"use client"

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import axios from 'axios';
import React, { useState } from 'react';
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Swal from "sweetalert2";


const FormLayout = () => {

    const [fullName, setFullName] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [dateOfBaptism, setDateOfBaptism] = useState('');
    const [esperanza, setEsperanza] = useState('');
    const [anciano, setAnciano] = useState(false);
    const [siervoMinisterial, setSiervoMinisterial] = useState(false);
    const [genero, setGenero] = useState('');
    const [precursorado, setPrecursorado] = useState('Publicador');

    const [hombre, setHombre] = useState(false);
    const [mujer, setMujer] = useState(false);
    const [otrasOvejas, setOtrasOvejas] = useState(false);
    const [ungido, setUngido] = useState(false);
    const [regular, setRegular] = useState(false);
    const [especial, setEspecial] = useState(false);
    const [misionero, setMisionero] = useState(false);

    const [grupo, setGrupo] = useState('');
    const [sg, setSg] = useState('');

    React.useEffect(() => {
        switch (grupo) {
            case '1':
                setSg('José Guadalupe Gutiérrez Pérez');
                break;
            case '2':
                setSg('Gustavo Alonso Hernández Balbuena');
                break;
            case '3':
                setSg('José Francisco Guajardo Trujano');
                break;
            case '4':
                setSg('Jorge Romero Coronel');
                break;
            case '5':
                setSg('Pedro Pablo Saavedra Vargas');
                break;
            case '6':
                setSg('David Alejandro Correa Araujo');
                break;
            default:
                setSg('');
                break;
        }
    }, [grupo]);


    React.useEffect(() => {
        if (hombre) {
            setGenero('Hombre');
            setMujer(false);

        } else if (mujer) {
            setGenero('Mujer');
            setHombre(false);
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

        if (!Date.parse(dateOfBirth) || !Date.parse(dateOfBaptism)) {
            Swal.fire('¡Error!', 'Por favor, ingresa una fecha válida', 'error');
            return;
        }
        if(!fullName || !dateOfBirth || !dateOfBaptism || !genero || !esperanza || !grupo || !sg) {
            Swal.fire('¡Error!', 'Llena todos los campos para seguir', 'error');
            return;
        }


        const createUserDto = {
            fullName,
            date_of_birth: new Date(dateOfBirth).toISOString().split('T')[0],
            date_of_baptism: new Date(dateOfBaptism).toISOString().split('T')[0],
            esperanza,
            anciano,
            siervo_ministerial: siervoMinisterial,
            genero,
            precursorado,
            grupo,
            sg
        };

        try {
            const response = await axios.post(`https://cardsatelitebackend-production.up.railway.app/users`, createUserDto);
            console.log(response.data);
            if(response.data.status === 409 && response.data.message === "Correo ya registrado") {
                Swal.fire('¡Error!', 'Hermano ya registrado', 'error');
            } else {
                Swal.fire('¡Reporte subido!', '¡Los datos se enviaron correctamente!', 'success');
            }
        } catch (error) {
            Swal.fire('¡Error!', 'Llena todos los campos para seguir', 'error');
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
                                <div className="mb-4.5 ">
                                    <div className="w-full ">
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
                                    <select id="grupo"
                                            value={grupo}
                                            onChange={(e) => setGrupo(e.target.value)}
                                            className="w-full mb-3 rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary">
                                        <option value="">Grupo</option>
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        Género
                                    </label>
                                    <div className="mb-4.5 grid grid-cols-3 gap-4">
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="hombre"
                                                    type="checkbox"
                                                    checked={hombre}
                                                    onChange={(e) => {
                                                        setHombre(e.target.checked);
                                                        if (e.target.checked) {
                                                            setMujer(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="hombre" className="text-gray-700">
                                                    Hombre
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="mujer"
                                                    type="checkbox"
                                                    checked={mujer}
                                                    onChange={(e) => {
                                                        setMujer(e.target.checked);
                                                        if (e.target.checked) {
                                                            setHombre(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="mujer" className="text-gray-700">
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
                                                    id="otrasOvejas"
                                                    type="checkbox"
                                                    checked={otrasOvejas}
                                                    onChange={(e) => {
                                                        setOtrasOvejas(e.target.checked);
                                                        if (e.target.checked) {
                                                            setUngido(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="otrasOvejas" className="text-gray-700">
                                                    Otras Ovejas
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="ungido"
                                                    type="checkbox"
                                                    checked={ungido}
                                                    onChange={(e) => {
                                                        setUngido(e.target.checked);
                                                        if (e.target.checked) {
                                                            setOtrasOvejas(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="ungido" className="text-gray-700">
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
                                                    id="anciano"
                                                    type="checkbox"
                                                    checked={anciano}
                                                    onChange={(e) => {
                                                        setAnciano(e.target.checked);
                                                        if (e.target.checked) {
                                                            setSiervoMinisterial(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="anciano" className="text-gray-700">
                                                    Anciano
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="siervoMinisterial"
                                                    type="checkbox"
                                                    checked={siervoMinisterial}
                                                    onChange={(e) => {
                                                        setSiervoMinisterial(e.target.checked);
                                                        if (e.target.checked) {
                                                            setAnciano(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="siervoMinisterial" className="text-gray-700">
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
                                                    id="regular"
                                                    type="checkbox"
                                                    checked={regular}
                                                    onChange={(e) => {
                                                        setRegular(e.target.checked);
                                                        if (e.target.checked) {
                                                            setEspecial(false);
                                                            setMisionero(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="regular" className="text-gray-700">
                                                    Precursor Regular
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="especial"
                                                    type="checkbox"
                                                    checked={especial}
                                                    onChange={(e) => {
                                                        setEspecial(e.target.checked);
                                                        if (e.target.checked) {
                                                            setRegular(false);
                                                            setMisionero(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="especial" className="text-gray-700">
                                                    Precursor Especial
                                                </label>
                                            </div>
                                        </div>
                                        <div className="max-w-xs">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    id="misionero"
                                                    type="checkbox"
                                                    checked={misionero}
                                                    onChange={(e) => {
                                                        setMisionero(e.target.checked);
                                                        if (e.target.checked) {
                                                            setRegular(false);
                                                            setEspecial(false);
                                                        }
                                                    }}
                                                    className="form-checkbox h-5 w-5 text-blue-600"
                                                />
                                                <label htmlFor="misionero" className="text-gray-700">
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
