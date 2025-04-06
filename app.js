// Initialize the Supabase client using the embedded environment variables
const supabase = createClient(window.supabaseUrl, window.supabaseAnonKey);

document.addEventListener('DOMContentLoaded', async () => {
    await loadDropdowns();
    await loadGarments();

    document.getElementById('garment-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const type = document.getElementById('type').value;
        const color = document.getElementById('color').value;
        const description = document.getElementById('description').value;

        await supabase.from('garments').insert([{ type_id: type, color_id: color, description }]);
        await loadGarments();
    });
});

async function loadDropdowns() {
    const { data: types } = await supabase.from('garment_types').select('*');
    const { data: colors } = await supabase.from('garment_colors').select('*');

    const typeSelect = document.getElementById('type');
    const colorSelect = document.getElementById('color');

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type.id;
        option.textContent = type.type;
        typeSelect.appendChild(option);
    });

    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.id;
        option.textContent = color.color;
        colorSelect.appendChild(option);
    });
}

async function loadGarments() {
    const { data: garments } = await supabase.from('garments').select('*, garment_types(type), garment_colors(color)');
    const garmentList = document.getElementById('garment-list');
    garmentList.innerHTML = '';

    garments.forEach(garment => {
        const li = document.createElement('li');
        li.textContent = `${garment.garment_types.type} - ${garment.garment_colors.color}: ${garment.description}`;
        garmentList.appendChild(li);
    });
}