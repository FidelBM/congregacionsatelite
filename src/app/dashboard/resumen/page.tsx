"use client";
import { Package } from "@/types/package";
import React, { useState, useEffect } from "react";
import axios from "axios";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import * as XLSX from "xlsx";

interface Card {
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
    grupo: number;
    sg: string;
    createdAt: string;
    updatedAt: string;
  };
}

interface User {
  id: number;
  fullName: string;
  date_of_birth: string;
  date_of_baptism: string;
  esperanza: string;
  anciano: boolean;
  siervo_ministerial: boolean;
  genero: string;
  precursorado: string;
  grupo: number;
  sg: string;
  createdAt: string;
  updatedAt: string;
}

const TableThree = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [cards, setCards] = useState<Card[]>([]);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [privilegeFilter, setPrivilegeFilter] = useState<string>("");
  const [reportStatusFilter, setReportStatusFilter] = useState<string>("");

  const usersWithCards = users.map((user) => ({
    ...user,
    cards: cards.filter((card) => card.userId === user.id),
  }));

  const filteredUsers = usersWithCards.filter(
    (user) =>
      user.fullName.toLowerCase().includes(nameFilter.toLowerCase()) &&
      user.precursorado.toLowerCase().includes(privilegeFilter.toLowerCase()) &&
      (reportStatusFilter === "" ||
        (reportStatusFilter === "Reportado"
          ? user.cards.length > 0
          : user.cards.length === 0))
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
        );
        setUsers(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCards = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cards`
        );
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const cardsThisMonth = response.data.filter((card: Card) => {
          const cardMonth = new Date(card.createdAt).getMonth();
          const cardYear = new Date(card.createdAt).getFullYear();
          return cardMonth === currentMonth && cardYear === currentYear;
        });
        setCards(cardsThisMonth);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
    fetchCards();
  }, []);

  function exportToExcel() {
    // Crear un nuevo libro de trabajo
    const wb = XLSX.utils.book_new();

    // Crear una hoja de trabajo para cada conjunto de datos
    const ws1 = XLSX.utils.json_to_sheet(dataTotales);
    const ws2 = XLSX.utils.json_to_sheet(dataPromedios);
    const ws3 = XLSX.utils.json_to_sheet(tableData);

    const headers = ["A1", "B1", "C1", "D1", "E1"]; // Ajustar según el número de columnas
    headers.forEach((header) => {
      if (ws1[header]) ws1[header].s = { font: { bold: true } };
      if (ws2[header]) ws2[header].s = { font: { bold: true } };
      if (ws3[header]) ws3[header].s = { font: { bold: true } };
    });

    // Añadir las hojas de trabajo al libro de trabajo
    XLSX.utils.book_append_sheet(wb, ws1, "Totales");
    XLSX.utils.book_append_sheet(wb, ws2, "Promedios");
    XLSX.utils.book_append_sheet(wb, ws3, "Publicadores");

    // Escribir el libro de trabajo en un archivo
    XLSX.writeFile(wb, "resumen.xlsx");
  }
  const dataTotales = [
    {
      Descripcion: "Publicadores",
      Cantidad:
        users.filter((user) => user.precursorado === "Publicador").length -
        cards.filter((card) => card.auxiliar).length,
      Informaron: cards.filter(
        (card) => card.user.precursorado === "Publicador" && !card.auxiliar
      ).length,
      Cursos: cards
        .filter(
          (card) => card.user.precursorado === "Publicador" && !card.auxiliar
        )
        .map((card) => card.cursos)
        .reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0),
      Horas: cards
        .filter(
          (card) => card.user.precursorado === "Publicador" && !card.auxiliar
        )
        .map((card) => card.horas)
        .reduce((acc, curr) => acc + Number(curr ?? 0), 0),
    },
    {
      Descripcion: "Precursores Regulares",
      Cantidad: users.filter(
        (user) => user.precursorado === "Precursor Regular"
      ).length,
      Informaron: cards.filter(
        (card) => card.user.precursorado === "Precursor Regular"
      ).length,
      Cursos: cards
        .filter((card) => card.user.precursorado === "Precursor Regular")
        .map((card) => card.cursos)
        .reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0),
      Horas: cards
        .filter((card) => card.user.precursorado === "Precursor Regular")
        .map((card) => card.horas)
        .reduce((acc, curr) => acc + Number(curr ?? 0), 0),
    },
    {
      Descripcion: "Precursores Auxiliares",
      Cantidad: cards.filter((card) => card.auxiliar).length,
      Informaron: cards.filter((card) => card.auxiliar).length,
      Cursos: cards
        .filter((card) => card.auxiliar)
        .map((card) => card.cursos)
        .reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0),
      Horas: cards
        .filter((card) => card.auxiliar)
        .map((card) => card.horas)
        .reduce((acc, curr) => acc + Number(curr ?? 0), 0),
    },
    {
      Descripcion: "Total",
      Cantidad: users.length,
      Informaron: cards.length,
      Cursos: cards
        .map((card) => card.cursos)
        .reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0),
      Horas: cards
        .map((card) => card.horas)
        .reduce((acc, curr) => acc + Number(curr ?? 0), 0),
    },
  ];

  const dataPromedios = [
    {
      Descripcion: "Publicadores",
      Cursos:
        cards
          .filter(
            (card) => card.user.precursorado === "Publicador" && !card.auxiliar
          )
          .map((card) => card.cursos)
          .reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0) /
        cards.filter(
          (card) => card.user.precursorado === "Publicador" && !card.auxiliar
        ).length,
      Horas:
        cards
          .filter(
            (card) => card.user.precursorado === "Publicador" && !card.auxiliar
          )
          .map((card) => card.horas)
          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
        cards.filter(
          (card) => card.user.precursorado === "Publicador" && !card.auxiliar
        ).length,
    },
    {
      Descripcion: "Precursores Regulares",
      Cursos:
        cards
          .filter((card) => card.user.precursorado === "Precursor Regular")
          .map((card) => card.cursos)
          .reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0) /
        cards.filter((card) => card.user.precursorado === "Precursor Regular")
          .length,
      Horas:
        cards
          .filter((card) => card.user.precursorado === "Precursor Regular")
          .map((card) => card.horas)
          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
        cards.filter((card) => card.user.precursorado === "Precursor Regular")
          .length,
    },
    {
      Descripcion: "Precursores Auxiliares",
      Cursos:
        cards
          .filter((card) => card.auxiliar)
          .map((card) => card.cursos)
          .reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0) /
        cards.filter((card) => card.auxiliar).length,
      Horas:
        cards
          .filter((card) => card.auxiliar)
          .map((card) => card.horas)
          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
        cards.filter((card) => card.auxiliar).length,
    },
    {
      Descripcion: "Total",
      Cursos:
        cards
          .map((card) => card.cursos)
          .reduce((acc, curr) => acc + (curr ? parseInt(curr) : 0), 0) /
        cards.length,
      Horas: (
        cards
          .filter((card) => card.user.precursorado === "Precursor Regular")
          .map((card) => card.horas)
          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
          cards.filter((card) => card.user.precursorado === "Precursor Regular")
            .length +
        cards
          .filter((card) => card.auxiliar)
          .map((card) => card.horas)
          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
          cards.filter((card) => card.auxiliar).length
      ).toFixed(2),
    },
  ];
  const tableData = filteredUsers.map((user) => ({
    sg: user.sg,
    grupo: user.grupo,
    fullName: user.fullName,
    precursorado:
      cards.filter((card) => card.userId === user.id && card.auxiliar).length >
      0
        ? "Precursor Auxiliar"
        : user.precursorado,
    predico: cards
      .filter((card) => card.userId === user.id)
      .map((card) => (card.predico ? "Si" : "No"))
      .join(", "),
    cursos: cards
      .filter((card) => card.userId === user.id)
      .map((card) => card.cursos?.toString())
      .join(", "),
    horas: cards
      .filter((card) => card.userId === user.id)
      .map((card) => card.horas?.toString())
      .join(", "),
    comentarios: cards
      .filter((card) => card.userId === user.id)
      .map((card) => card.comentarios?.toString())
      .join(", "),
  }));

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Resumen" />

      <div className="flex flex-col gap-10">
        <button
          onClick={exportToExcel}
          className="bg-green-300 p-5 rounded text-black-2 font-bold"
        >
          Descargar Excel
        </button>
        
        <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <div className="max-w-full overflow-x-auto">
            <h1 className="text-2xl text-black-2 font-bold m-5">Totales</h1>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Descripcion
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Cantidad
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Informaron
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Cursos
                  </th>

                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Horas
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">Publicadores</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {users.filter(
                        (user) => user.precursorado === "Publicador"
                      ).length - cards.filter((card) => card.auxiliar).length}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="text-black dark:text-white">
                      {
                        cards.filter(
                          (card) =>
                            card.user.precursorado === "Publicador" &&
                            !card.auxiliar
                        ).length
                      }
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {cards
                        .filter(
                          (card) =>
                            card.user.precursorado === "Publicador" &&
                            !card.auxiliar
                        )
                        .map((card) => card.cursos)
                        .reduce(
                          (acc, curr) => acc + (curr ? parseInt(curr) : 0),
                          0
                        )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {cards
                        .filter(
                          (card) =>
                            card.user.precursorado === "Publicador" &&
                            !card.auxiliar
                        )
                        .map((card) => card.horas)
                        .reduce((acc, curr) => acc + Number(curr ?? 0), 0)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      Precursores Regulares
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {
                        users.filter(
                          (precursores) =>
                            precursores.precursorado === "Precursor Regular"
                        ).length
                      }
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="text-black dark:text-white">
                      {
                        cards.filter(
                          (card) =>
                            card.user.precursorado === "Precursor Regular"
                        ).length
                      }
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {cards
                        .filter(
                          (card) =>
                            card.user.precursorado === "Precursor Regular"
                        )
                        .map((card) => card.cursos)
                        .reduce(
                          (acc, curr) => acc + (curr ? parseInt(curr) : 0),
                          0
                        )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {cards
                        .filter(
                          (card) =>
                            card.user.precursorado === "Precursor Regular"
                        )
                        .map((card) => card.horas)
                        .reduce((acc, curr) => acc + Number(curr ?? 0), 0)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      Precursores Auxiliares
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {cards.filter((card) => card.auxiliar).length}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className=" text-black dark:text-white">
                      {cards.filter((card) => card.auxiliar).length}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {cards
                        .filter((card) => card.auxiliar)
                        .map((card) => card.cursos)
                        .reduce(
                          (acc, curr) => acc + (curr ? parseInt(curr) : 0),
                          0
                        )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {cards
                        .filter((card) => card.auxiliar)
                        .map((card) => card.horas)
                        .reduce((acc, curr) => acc + Number(curr ?? 0), 0)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      Total
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {users.length}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <h5 className="font-medium text-black dark:text-white">
                      {cards.length}
                    </h5>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {cards
                        .map((card) => card.cursos)
                        .reduce(
                          (acc, curr) => acc + (curr ? parseInt(curr) : 0),
                          0
                        )}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {cards
                        .map((card) => card.horas)
                        .reduce((acc, curr) => acc + Number(curr ?? 0), 0)}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="max-w-full overflow-x-auto">
            <h1 className="text-2xl text-black-2 font-bold m-5">Promedio</h1>
            <table className="w-full table-auto" id="promedio">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Descripcion
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Cursos
                  </th>

                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Horas
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">Publicadores</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {(
                        cards
                          .filter(
                            (card) =>
                              card.user.precursorado === "Publicador" &&
                              !card.auxiliar
                          )
                          .map((card) => card.cursos)
                          .reduce(
                            (acc, curr) => acc + (curr ? parseInt(curr) : 0),
                            0
                          ) /
                        cards.filter(
                          (card) =>
                            card.user.precursorado === "Publicador" &&
                            !card.auxiliar
                        ).length
                      ).toFixed(2)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {(
                        cards
                          .filter(
                            (card) =>
                              card.user.precursorado === "Publicador" &&
                              !card.auxiliar
                          )
                          .map((card) => card.horas)
                          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
                        cards.filter(
                          (card) =>
                            card.user.precursorado === "Publicador" &&
                            !card.auxiliar
                        ).length
                      ).toFixed(2)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      Precursores Regulares
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {(
                        cards
                          .filter(
                            (card) =>
                              card.user.precursorado === "Precursor Regular"
                          )
                          .map((card) => card.cursos)
                          .reduce(
                            (acc, curr) => acc + (curr ? parseInt(curr) : 0),
                            0
                          ) /
                        cards.filter(
                          (card) =>
                            card.user.precursorado === "Precursor Regular"
                        ).length
                      ).toFixed(2)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {(
                        cards
                          .filter(
                            (card) =>
                              card.user.precursorado === "Precursor Regular"
                          )
                          .map((card) => card.horas)
                          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
                        cards.filter(
                          (card) =>
                            card.user.precursorado === "Precursor Regular"
                        ).length
                      ).toFixed(2)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      Precursores Auxiliares
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {(
                        cards
                          .filter((card) => card.auxiliar)
                          .map((card) => card.cursos)
                          .reduce(
                            (acc, curr) => acc + (curr ? parseInt(curr) : 0),
                            0
                          ) / cards.filter((card) => card.auxiliar).length
                      ).toFixed(2)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">
                      {(
                        cards
                          .filter((card) => card.auxiliar)
                          .map((card) => card.horas)
                          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
                        cards.filter((card) => card.auxiliar).length
                      ).toFixed(2)}
                    </p>
                  </td>
                </tr>
                <tr>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      Total
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {(
                        cards
                          .map((card) => card.cursos)
                          .reduce(
                            (acc, curr) => acc + (curr ? parseInt(curr) : 0),
                            0
                          ) / cards.length
                      ).toFixed(2)}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {(
                        cards
                          .filter(
                            (card) =>
                              card.user.precursorado === "Precursor Regular"
                          )
                          .map((card) => card.horas)
                          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
                          cards.filter(
                            (card) =>
                              card.user.precursorado === "Precursor Regular"
                          ).length +
                        cards
                          .filter((card) => card.auxiliar)
                          .map((card) => card.horas)
                          .reduce((acc, curr) => acc + Number(curr ?? 0), 0) /
                          cards.filter((card) => card.auxiliar).length
                      ).toFixed(2)}
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="max-w-full overflow-x-auto mt-4">
            <h1 className="text-2xl text-black-2 font-bold m-5">
              Publicadores
            </h1>
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    S. Grupo
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Grupo
                  </th>
                  <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                    Nombre
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Asignación
                  </th>

                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Predicó
                  </th>

                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Cursos
                  </th>

                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Horas
                  </th>
                  <th className="px-4 py-4 font-medium text-black dark:text-white">
                    Comentarios
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, key) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">{user.sg}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">{user.grupo}</p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {user.fullName}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {cards.filter(
                          (card) => card.userId === user.id && card.auxiliar
                        ).length > 0
                          ? "Precursor Auxiliar"
                          : user.precursorado}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {cards
                          .filter((card) => card.userId === user.id)
                          .map((card) => (card.predico ? "Si" : "No"))}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {cards
                          .filter((card) => card.userId === user.id)
                          .map((card) => card.cursos?.toString())}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {cards
                          .filter((card) => card.userId === user.id)
                          .map((card) => card.horas?.toString())}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {cards
                          .filter((card) => card.userId === user.id)
                          .map((card) => card.comentarios?.toString())}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TableThree;
