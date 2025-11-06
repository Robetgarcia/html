document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('proc_poke');
    const btnSearch = document.getElementById('BtnBuscar');
    const btnHistory = document.querySelector('#opcoes_button button');
    const formBox = document.querySelector('.form_box_1');
    let history = JSON.parse(localStorage.getItem('pokemonHistory')) || [];

    function createResults() {
        let container = document.getElementById('results');
        if (container) container.remove();
        container = document.createElement('section');
        container.id = 'results';
        container.innerHTML = '<h3 id="title">Resultados</h3><div id="info"></div>';
        formBox.appendChild(container);
    }

    async function fetchPoke(name) {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase().trim()}`);
        if (!res.ok) throw new Error('Pokémon não encontrado!');
        return await res.json();
    }

    function showPoke(poke) {
        const info = document.getElementById('info');
        const types = poke.types.map(t => t.type.name).join(', ');
        info.innerHTML = `
            <div class="poke-card">
                <img src="${poke.sprites.front_default}" alt="${poke.name}">
                <h4>${poke.name.charAt(0).toUpperCase() + poke.name.slice(1)}</h4>
                <p>ID: #${poke.id}</p>
                <p>Tipos: ${types}</p>
                <p>Altura: ${poke.height / 10}m | Peso: ${poke.weight / 10}kg</p>
            </div>
        `;
    }

    function showError(msg) {
        document.getElementById('info').innerHTML = `<p style="color:red; text-align:center;">${msg}</p>`;
    }

    function addHistory(name) {
        if (!history.includes(name)) {
            history.unshift(name);
            if (history.length > 10) history = history.slice(0, 10);
            localStorage.setItem('pokemonHistory', JSON.stringify(history));
        }
    }

    function showHistory() {
        const container = createResults();
        document.getElementById('title').textContent = 'Histórico';
        const info = document.getElementById('info');
        if (history.length === 0) {
            info.innerHTML = '<p style="text-align:center;">Sem buscas.</p>';
            return;
        }
        info.innerHTML = history.map(name => 
            `<button class="hist-btn" data-name="${name}" style="margin:5px; padding:8px; background:#ff5959; color:white; border:none; border-radius:5px; cursor:pointer;">${name.charAt(0).toUpperCase() + name.slice(1)}</button>`
        ).join('');
        document.querySelectorAll('.hist-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.dataset.name;
                input.value = name;
                search();
            });
        });
    }
    async function search() {
        const name = input.value.trim();
        if (!name) return alert('Digite um nome!');
        const container = createResults();
        document.getElementById('title').textContent = `Buscando ${name}...`;
        try {
            const poke = await fetchPoke(name);
            showPoke(poke);
            addHistory(name.toLowerCase());
        } catch (err) {
            showError(err.message);
        }
    }
    btnSearch.addEventListener('click', search);
    input.addEventListener('keypress', e => e.key === 'Enter' && search());
    btnHistory.addEventListener('click', showHistory);
});