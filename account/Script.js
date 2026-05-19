const SUPABASE_URL = 'https://pcxhlgnlrlsnlpmgcbai.supabase.co';
const SUPABASE_KEY = 'sb_publishable_eKRCiIBSRE_6al_hc0rOHA_P5wL6KeQ';
let client = null;

document.addEventListener("DOMContentLoaded", () => {
    console.log('DOMContentLoaded - Supabase:', typeof supabase !== 'undefined' ? 'geladen' : 'NICHT geladen');
    
    if (typeof supabase !== 'undefined') {
        try {
            client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
            console.log('Supabase Client initialisiert');
        } catch (err) {
            console.error('Fehler beim Initialisieren von Supabase:', err);
        }
    } else {
        console.error('Supabase ist nicht geladen!');
    }

    const loginForm = document.getElementById("login-form");
    
    if (!loginForm) {
        console.error('Login-Formular nicht gefunden!');
        return;
    }

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();
        console.log('Login-Submit ausgelöst');
        handleLogin();
    });
    
    console.log('Event-Listener hinzugefügt');
});

async function handleLogin() {
    const msgDiv = document.getElementById('message');
    const identifier = document.getElementById('identifier').value.trim();
    const password = document.getElementById('password').value;

    msgDiv.style.display = 'block';
    msgDiv.className = '';
    msgDiv.innerText = 'Prüfe Zugangsdaten...';

    if (!identifier || !password) {
        msgDiv.innerText = 'Bitte gib E-Mail und Passwort ein.';
        msgDiv.className = 'error';
        return;
    }

    if (!client) {
        msgDiv.innerText = 'Fehler: Supabase konnte nicht geladen werden. Bitte Seite neu laden.';
        msgDiv.className = 'error';
        return;
    }

    try {
        const { data, error } = await client.auth.signInWithPassword({
            email: identifier,
            password,
        });

        if (error) {
            msgDiv.innerText = 'Error: ' + error.message;
            msgDiv.className = 'error';
            return;
        }

        if (data.user) {
            msgDiv.innerText = 'Erfolgreich eingeloggt! Weiterleitung zum Forum...';
            msgDiv.className = 'success';
            setTimeout(() => {
                window.location.href = 'forum.html';
            }, 1500);
        } else {
            msgDiv.innerText = 'Anmeldung fehlgeschlagen. Bitte überprüfe deine Daten.';
            msgDiv.className = 'error';
        }
    } catch (err) {
        msgDiv.innerText = 'Kritischer Fehler: ' + err.message;
        msgDiv.className = 'error';
    }
}
