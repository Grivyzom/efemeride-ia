
        // Función para obtener la fecha actual
        function getCurrentDate() {
            return new Date().toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        }

        // Función para actualizar la hora
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-ES', { hour12: false });
            document.getElementById('current-time').textContent = timeString;
        }

        // Función para obtener la efeméride del día
        function getTodayEphemeris() {
            const today = new Date();
            const key = String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                       String(today.getDate()).padStart(2, '0');
            
            return ephemerides[key] || {
                year: "1970",
                event: "Unix timestamp comienza en este día, estableciendo el 1 de enero de 1970 como punto de referencia para muchos sistemas informáticos."
            };
        }

        // Función para crear partículas flotantes
        function createParticles() {
            const container = document.getElementById('particles-container');
            
            setInterval(() => {
                if (document.querySelectorAll('.particle').length < 15) {
                    const particle = document.createElement('div');
                    particle.className = 'particle';
                    
                    const size = Math.random() * 4 + 1;
                    const left = Math.random() * 100;
                    const animationDuration = Math.random() * 10 + 10;
                    
                    particle.style.width = size + 'px';
                    particle.style.height = size + 'px';
                    particle.style.left = left + '%';
                    particle.style.animationDuration = animationDuration + 's';
                    
                    container.appendChild(particle);
                    
                    setTimeout(() => {
                        if (container.contains(particle)) {
                            container.removeChild(particle);
                        }
                    }, animationDuration * 1000);
                }
            }, 2000);
        }

        // Función para mostrar elementos con retraso
        function showElementsSequentially() {
            setTimeout(() => {
                document.getElementById('date-container').style.display = 'block';
                document.getElementById('current-date').textContent = 'Fecha actual: ' + getCurrentDate();
            }, 4000);

            setTimeout(() => {
                document.getElementById('ephemeris-container').style.display = 'block';
                const ephemeris = getTodayEphemeris();
                document.getElementById('ephemeris-date').textContent = ephemeris.year + ':';
                document.getElementById('ephemeris-text').textContent = ephemeris.event;
            }, 5000);

            setTimeout(() => {
                document.getElementById('final-prompt').style.display = 'flex';
            }, 6000);

            setTimeout(() => {
                document.getElementById('footer').style.display = 'block';
            }, 7000);

            setTimeout(() => {
                document.getElementById('loading').style.display = 'none';
            }, 4000);
        }

        // Función para copiar texto
        function setupCopyButton() {
            document.getElementById('copy-btn').addEventListener('click', async () => {
                const ephemeris = getTodayEphemeris();
                const textToCopy = `🖥️ Efeméride de Programación - ${getCurrentDate()}\n\n${ephemeris.year}: ${ephemeris.event}\n\n#Programación #Historia #CodeHistory`;
                
                try {
                    await navigator.clipboard.writeText(textToCopy);
                    
                    const btn = document.getElementById('copy-btn');
                    const originalContent = btn.innerHTML;
                    btn.innerHTML = '<span>✅</span><span>Copiado!</span>';
                    btn.classList.add('bg-green-500/40');
                    
                    setTimeout(() => {
                        btn.innerHTML = originalContent;
                        btn.classList.remove('bg-green-500/40');
                    }, 2000);
                } catch (err) {
                    console.error('Error al copiar:', err);
                }
            });
        }

        // Inicialización
        document.addEventListener('DOMContentLoaded', () => {
            updateTime();
            setInterval(updateTime, 1000);
            createParticles();
            showElementsSequentially();
            setupCopyButton();
        });

        // Prevenir selección accidental pero permitir copia programática
        document.addEventListener('selectstart', (e) => {
            if (!e.target.closest('#copy-btn')) {
                e.preventDefault();
            }
        });