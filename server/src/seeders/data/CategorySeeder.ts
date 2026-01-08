import apiAdeme from "../ApiAdemeCall";

const TestCategories = [
    { id: 1, title: "Transport" },
    { id: 2, title: "Alimentation" },
    { id: 3, title: "Énergie" },
  ];
  
  export { TestCategories };

export async function fetchCategories() {
  try{
    const resp = await apiAdeme.get('/thematiques');
    console.log(`Fetched all categories, count = ${resp.data.length}`)
    console.log('Example theme:', JSON.stringify(resp.data[0], null, 2))
    return resp.data;
  } catch (err: any) {
    console.error('Erreur fetch all themes:', err.response?.status, err.message);
    throw err;
  }
}