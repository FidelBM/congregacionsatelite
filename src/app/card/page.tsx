const FormLayout = () => {
  return (
    <div className="flex w-full p-5 flex-col text-sm">
      <div className="flex w-full justify-center">
        <h1 className="text-lg m-5">
          REGISTRO DE PUBLICADOR DE LA CONGREGACIÓN
        </h1>
      </div>
      <div className="flex flex-row w-ful">
        <div className="flex flex-col w-1/8">
          <p>Nombre: </p>
          <p>Fecha de nacimiento: </p>
          <p>Fecha de bautismo: </p>
        </div>
        <div className="flex flex-col w-2/4 pl-5">
          <p>Teresa Reyes Hernandez</p>
          <p>15 de octubre de 1938</p>
          <p>9 de junio de 1974</p>
        </div>
        <div className="flex flex-col w-1/8 pl-5">
          <label>
            <input type="checkbox" className="" /> Hombre
          </label>
          <label>
            <input type="checkbox" className="" /> Otras Ovejas
          </label>
        </div>

        <div className="flex flex-col w-1/8 pl-5">
          <label>
            <input type="checkbox" className="" /> Mujer
          </label>
          <label>
            <input type="checkbox" className="" /> Ungidos
          </label>
        </div>
      </div>
      <div className="flex flex-row ">
        <label className="w-1/5">
          <input type="checkbox" className="" /> Anciano
        </label>
        <label className=" w-1/5">
          <input type="checkbox" className="" /> Siervo ministerial
        </label>
        <label className=" w-1/5">
          <input type="checkbox" className="" /> Precursor regular
        </label>
        <label className=" w-1/5">
          <input type="checkbox" className="" /> Precursor especial
        </label>
        <label className=" w-1/5">
          <input type="checkbox" className="" /> Misionero que sirve en el campo
        </label>
      </div>
      <div className="mt-5">
        <table>
          <thead className="font-normal">
            <tr>
              <th className="w-1/8 border-2 font-normal p-2">
                Año de servicio 2023-2024
              </th>
              <th className="w-1/8 border-2 font-normal p-2">
                Participación en el ministerio
              </th>
              <th className="w-1/8 border-2 font-normal p-2">
                Cursos bíblicos
              </th>
              <th className="w-1/8 border-2 font-normal p-2">
                Precursor auxiliar
              </th>
              <th className="w-1/5 border-2 font-normal p-2">
                Horas (Si es precursor o misionero que sirve en el campo)
              </th>
              <th className="w-1/5 border-2 font-normal p-2">Notas</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-2 p-2">Septiembre</td>
              <td className="border-2">
                <div className="w-full text-center">
                  <input type="checkbox" className="" />
                </div>
              </td>
              <td className="border-2 text-center">1</td>
              <td className="border-2">
                <div className="w-full text-center">
                  <input type="checkbox" className="" />
                </div>
              </td>
              <td className="border-2 text-center">
                10
              </td>
              <td className="border-2 p-2">Estuve 10 horas en el ministerio</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Octubre</td>
              <td className="border-2">
                <div className="w-full text-center">
                  <input type="checkbox" className="" />
                </div>
              </td>
              <td className="border-2 text-center">1</td>
              <td className="border-2">
                <div className="w-full text-center">
                  <input type="checkbox" className="" />
                </div>
              </td>
              <td className="border-2 text-center">
                10
              </td>
              <td className="border-2 p-2">Estuve 10 horas</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Noviembre</td>
              <td className="border-2">
                <div className="w-full text-center">
                  <input type="checkbox" className="" />
                </div>
              </td>
              <td className="border-2 text-center">1</td>
              <td className="border-2">
                <div className="w-full text-center">
                  <input type="checkbox" className="" />
                </div>
              </td>
              <td className="border-2 text-center">
                10
              </td>
              <td className="border-2 p-2">Estuve 10 horas</td>
            </tr>
            <tr>
              <td className="border-2 p-2">Diciembre</td>
              <td className="border-2">
                <div className="w-full text-center">
                  <input type="checkbox" className="" />
                </div>
              </td>
              <td className="border-2 text-center">1</td>
              <td className="border-2">
                <div className="w-full text-center">
                  <input type="checkbox" className="" />
                </div>
              </td>
              <td className="border-2 text-center">
                10
              </td>
              <td className="border-2 p-2">Estuve 10 horas</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FormLayout;
