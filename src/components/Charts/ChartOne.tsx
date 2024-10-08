import { ApexOptions } from "apexcharts";
import React, { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";

const options: ApexOptions = {
  legend: {
    show: false,
    position: "top",
    horizontalAlign: "left",
  },
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    height: 335,
    type: "area",
    dropShadow: {
      enabled: true,
      color: "#623CEA14",
      top: 10,
      blur: 4,
      left: 0,
      opacity: 0.1,
    },

    toolbar: {
      show: false,
    },
  },
  responsive: [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
      },
    },
    {
      breakpoint: 1366,
      options: {
        chart: {
          height: 350,
        },
      },
    },
  ],
  stroke: {
    width: [2, 2],
    curve: "straight",
  },
  // labels: {
  //   show: false,
  //   position: "top",
  // },
  grid: {
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
  },
  dataLabels: {
    enabled: false,
  },
  markers: {
    size: 4,
    colors: "#fff",
    strokeColors: ["#3056D3", "#80CAEE"],
    strokeWidth: 3,
    strokeOpacity: 0.9,
    strokeDashArray: 0,
    fillOpacity: 1,
    discrete: [],
    hover: {
      size: undefined,
      sizeOffset: 5,
    },
  },
  xaxis: {
    type: "category",
    categories: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    title: {
      style: {
        fontSize: "0px",
      },
    },
    min: 0,
    max: 150,
  },
};

interface ChartOneState {
  series: {
    name: string;
    data: number[];
  }[];
}

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
    createdAt: string;
    updatedAt: string;
  };
}

const ChartOne: React.FC = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [state, setState] = useState<ChartOneState>({
    series: [
      {
        name: "Product One",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
      {
        name: "Product Two",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
      },
    ],
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
        );
        setTotalUsers(response.data.length);

        const response2 = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/cards`
        );
        const currentYear = new Date().getFullYear();
        let monthlyCardsTemp = Array(12).fill(0); // Array temporal para almacenar el número de tarjetas para cada mes

        for (let month = 8; month < 20; month++) {
          // Comienza en septiembre (mes 8) y termina en agosto del próximo año (mes 19)
          const cardsThisMonth = response2.data.filter((card: Card) => {
            const cardMonth = new Date(card.createdAt).getMonth();
            console.log(cardMonth, month < 12 ? currentYear + 1 : currentYear);
            const cardYear = new Date(card.createdAt).getFullYear();
            return (
              cardMonth === month % 12 &&
              cardYear === (month < 12 ? currentYear - 1 : currentYear)
            );
          });

          monthlyCardsTemp[month % 12] = cardsThisMonth.length;
        }
        setState({
          series: [
            {
              name: "Publicadores Totales",
              data: [
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
                response.data.length,
              ],
            },
            {
              name: "Infomes Mensuales",
              data: monthlyCardsTemp,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  const handleReset = () => {
    setState((prevState) => ({
      ...prevState,
    }));
  };
  handleReset;

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Publicadores Totales</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Informes totales</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
