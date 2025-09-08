// Estado global da aplicação
let currentState = {
    currentDomain: 0,
    responses: {},
    results: null
};

// Cache para instâncias de gráficos Chart.js - OTIMIZAÇÃO: Evita recriações desnecessárias
let chartInstances = {
    radarChart: null,
    barChart: null
};

// Debounce utility para evitar operações excessivas - OTIMIZAÇÃO: Performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Loading state management - OTIMIZAÇÃO: UX durante operações pesadas
let loadingOverlay = null;
function showLoading(message = 'Carregando...') {
    if (!loadingOverlay) {
        loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'loading-overlay';
        loadingOverlay.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner"></div>
                <p class="loading-text">${message}</p>
            </div>
        `;
        document.body.appendChild(loadingOverlay);
    } else {
        loadingOverlay.querySelector('.loading-text').textContent = message;
    }
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    if (loadingOverlay) {
        loadingOverlay.style.display = 'none';
    }
}

// Inicialização da aplicação OTIMIZADA
document.addEventListener('DOMContentLoaded', function() {
    // OTIMIZAÇÃO: Performance timing
    performance.mark('dom-ready');
    
    // Tema fixo: escuro
    if (typeof applyTheme === 'function') {
        applyTheme('dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }

    initializeApplication();
    
    // OTIMIZAÇÃO: Configurar observers após DOM estar pronto
    setTimeout(() => {
        observeChartContainers();
    }, 100);
});

function initializeApplication() {
    // CRÍTICO: Aplicar estilos anti-layout-shift imediatamente
    applyAntiLayoutShiftStyles();
    
    // OTIMIZAÇÃO: Usar performance measurement
    if (window.measurePerformance) {
        window.measurePerformance('app-initialization', () => {
            renderDomainTabs();
            renderCurrentDomain();
            updateProgress();
            updateNavigation();
        });
    } else {
        renderDomainTabs();
        renderCurrentDomain();
        updateProgress();
        updateNavigation();
    }
    
    // CRÍTICO: Pre-configurar containers de gráficos na inicialização
    setTimeout(() => {
        preConfigureChartContainersOnLoad();
    }, 500);
    
    // OTIMIZAÇÃO: Marcar finalização da inicialização
    if (performance.mark) {
        performance.mark('app-initialized');
        performance.measure('app-startup', 'app-start', 'app-initialized');
    }
}

// NOVA FUNÇÃO: Pre-configurar containers na inicialização para evitar layout shift
function preConfigureChartContainersOnLoad() {
    const chartSelectors = ['#radarChart', '#barChart'];
    
    chartSelectors.forEach(selector => {
        const canvas = document.querySelector(selector);
        if (canvas && canvas.parentElement) {
            const container = canvas.parentElement;
            
            // Aplicar estilos críticos imediatamente
            container.style.cssText += `
                height: 400px !important;
                min-height: 400px !important;
                max-height: 400px !important;
                width: 100% !important;
                position: relative !important;
                overflow: hidden !important;
                display: flex !important;
                flex-direction: column !important;
                align-items: center !important;
                justify-content: flex-start !important;
                background: var(--surface);
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            `;
            
            // Canvas com dimensões pré-definidas
            canvas.style.cssText += `
                max-width: 400px !important;
                max-height: 400px !important;
                width: 100% !important;
                height: 100% !important;
            `;
        }
    });
}

// Renderização das abas de domínios
function renderDomainTabs() {
    const tabsContainer = document.getElementById('domainTabs');
    tabsContainer.innerHTML = '';

    assessmentData.domains.forEach((domain, index) => {
        const tab = document.createElement('div');
        tab.className = `domain-tab ${index === currentState.currentDomain ? 'active' : ''}`;
        tab.innerHTML = `${domain.icon} ${domain.name}`;
        tab.onclick = () => navigateToDomain(index);
        
        // Verificar se o domínio está completo
        if (isDomainComplete(domain.id)) {
            tab.classList.add('completed');
        }
        
        tabsContainer.appendChild(tab);
    });
}

// Verificar se um domínio está completo
function isDomainComplete(domainId) {
    const questions = assessmentData.questions[domainId];
    return questions.every(question => 
        currentState.responses[question.id] !== undefined
    );
}

// Renderização do domínio atual
function renderCurrentDomain() {
    const domain = assessmentData.domains[currentState.currentDomain];
    const questions = assessmentData.questions[domain.id];

    document.getElementById('domainTitle').textContent = `${domain.icon} ${domain.name}`;
    document.getElementById('domainDescription').textContent = domain.description;

    const questionsContainer = document.getElementById('questionsContainer');
    questionsContainer.innerHTML = '';

    questions.forEach(question => {
        const questionCard = createQuestionCard(question);
        questionsContainer.appendChild(questionCard);
    });
}

// Criação de card de pergunta
function createQuestionCard(question) {
    const card = document.createElement('div');
    card.className = 'question-card';
    card.innerHTML = `
        <div class="question-text">
            ${question.text}
            <span class="question-weight">Peso: ${question.weight}</span>
        </div>
        <div class="answer-options" id="options-${question.id}">
            ${assessmentData.choices.map(choice => `
                <div class="answer-option" 
                     data-question="${question.id}" 
                     data-value="${choice.value}"
                     onclick="selectAnswer('${question.id}', ${choice.value})">
                    <span class="answer-value">${choice.value}</span>
                    <div>${choice.label}</div>
                </div>
            `).join('')}
        </div>
    `;

    // Marcar resposta atual se existir
    if (currentState.responses[question.id] !== undefined) {
        setTimeout(() => {
            const selectedValue = currentState.responses[question.id];
            const option = card.querySelector(`[data-question="${question.id}"][data-value="${selectedValue}"]`);
            if (option) {
                option.classList.add('selected');
            }
        }, 100);
    }

    return card;
}

// OTIMIZAÇÃO: Debounced UI updates para evitar re-renders excessivos
const debouncedUIUpdate = debounce(() => {
    renderDomainTabs(); // Para mostrar domínios completos
    updateNavigation();
    updateProgress();
}, 100);

// Seleção de resposta - OTIMIZADO: Reduz re-renders desnecessários
function selectAnswer(questionId, value) {
    // Verificar se a resposta já existe para evitar operações desnecessárias
    if (currentState.responses[questionId] === value) {
        return;
    }

    // Remover seleção anterior - OTIMIZADO: Selector mais específico
    const questionContainer = document.getElementById(`options-${questionId}`);
    if (questionContainer) {
        const previousSelected = questionContainer.querySelector('.selected');
        if (previousSelected) {
            previousSelected.classList.remove('selected');
        }
    }

    // Adicionar nova seleção
    const selectedOption = document.querySelector(`[data-question="${questionId}"][data-value="${value}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        
        // Feedback visual imediato - OTIMIZAÇÃO: UX
        selectedOption.style.transform = 'scale(1.02)';
        setTimeout(() => {
            selectedOption.style.transform = '';
        }, 150);
    }

    // Salvar resposta
    currentState.responses[questionId] = value;

    // OTIMIZAÇÃO: Usar debounced updates para evitar múltiplas re-renderizações
    debouncedUIUpdate();
}

// Navegação entre domínios
function navigateToDomain(domainIndex) {
    if (domainIndex >= 0 && domainIndex < assessmentData.domains.length) {
        currentState.currentDomain = domainIndex;
        renderDomainTabs();
        renderCurrentDomain();
        updateProgress();
        updateNavigation();
        
        // Scroll para o topo
        document.getElementById('questionnaireSection').scrollIntoView({ behavior: 'smooth' });
    }
}

function previousDomain() {
    if (currentState.currentDomain > 0) {
        navigateToDomain(currentState.currentDomain - 1);
    }
}

function nextDomain() {
    if (currentState.currentDomain < assessmentData.domains.length - 1) {
        navigateToDomain(currentState.currentDomain + 1);
    }
}

// Atualização da barra de progresso
function updateProgress() {
    const totalQuestions = Object.keys(assessmentData.questions).reduce(
        (total, domainId) => total + assessmentData.questions[domainId].length, 0
    );
    const answeredQuestions = Object.keys(currentState.responses).length;
    
    const progressPercentage = (answeredQuestions / totalQuestions) * 100;
    
    document.getElementById('progressFill').style.width = `${progressPercentage}%`;
    document.getElementById('progressText').textContent = 
        `Domínio ${currentState.currentDomain + 1} de ${assessmentData.domains.length} - ${answeredQuestions}/${totalQuestions} perguntas respondidas`;
}

// Atualização dos botões de navegação
function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const finishBtn = document.getElementById('finishBtn');

    prevBtn.disabled = currentState.currentDomain === 0;
    
    const isLastDomain = currentState.currentDomain === assessmentData.domains.length - 1;
    const allQuestionsAnswered = Object.keys(currentState.responses).length === 
        Object.keys(assessmentData.questions).reduce((total, domainId) => total + assessmentData.questions[domainId].length, 0);

    if (isLastDomain && allQuestionsAnswered) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-block';
    } else {
        nextBtn.style.display = 'inline-block';
        nextBtn.disabled = currentState.currentDomain === assessmentData.domains.length - 1;
        finishBtn.style.display = 'none';
    }
}

// Cálculo dos resultados
function calculateResults() {
    const domainScores = {};
    let totalWeightedScore = 0;
    let totalWeight = 0;

    assessmentData.domains.forEach(domain => {
        const questions = assessmentData.questions[domain.id];
        let domainWeightedScore = 0;
        let domainWeight = 0;

        questions.forEach(question => {
            const response = currentState.responses[question.id] || 0;
            domainWeightedScore += response * question.weight;
            domainWeight += question.weight * 5; // Máximo possível (5 * peso)
        });

        const domainScore = domainWeight > 0 ? (domainWeightedScore / domainWeight) * 5 : 0;
        domainScores[domain.id] = {
            score: domainScore,
            name: domain.name,
            icon: domain.icon,
            weight: domain.weight
        };

        totalWeightedScore += domainScore * domain.weight;
        totalWeight += domain.weight;
    });

    const overallScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    const maturityLevel = getMaturityLevel(overallScore);

    currentState.results = {
        overallScore: Math.round(overallScore * 10) / 10,
        maturityLevel,
        domainScores,
        recommendations: generateRecommendations(),
        topGaps: generateTopGaps(domainScores)
    };

    return currentState.results;
}

// Determinar nível de maturidade
function getMaturityLevel(score) {
    return assessmentData.maturityLevels.find(level => 
        score >= level.range[0] && score <= level.range[1]
    ) || assessmentData.maturityLevels[0];
}

// Gerar recomendações personalizadas
function generateRecommendations() {
    const recommendations = [];
    
    Object.entries(currentState.responses).forEach(([questionId, value]) => {
        if (value < 5) { // Se não foi totalmente implementado
            const question = findQuestionById(questionId);
            if (question) {
                recommendations.push({
                    domain: getDomainByQuestionId(questionId),
                    question: question.text,
                    recommendation: question.recommendation,
                    priority: 5 - value, // Maior prioridade para valores menores
                    currentValue: value
                });
            }
        }
    });

    // Ordenar por prioridade (maior primeiro)
    return recommendations.sort((a, b) => b.priority - a.priority);
}

// Gerar top 5 gaps
function generateTopGaps(domainScores) {
    const gaps = Object.entries(domainScores)
        .map(([domainId, data]) => ({
            domain: data.name,
            icon: data.icon,
            score: data.score,
            gap: 5 - data.score
        }))
        .sort((a, b) => b.gap - a.gap)
        .slice(0, 5);

    return gaps;
}

// Funções auxiliares
function findQuestionById(questionId) {
    for (const domainId in assessmentData.questions) {
        const question = assessmentData.questions[domainId].find(q => q.id === questionId);
        if (question) return question;
    }
    return null;
}

function getDomainByQuestionId(questionId) {
    const domainId = questionId.split('_')[0];
    return assessmentData.domains.find(d => d.id === domainId);
}

// Exibir resultados - OTIMIZADO: Processamento assíncrono com loading states
async function showResults() {
    // Verificar se todas as perguntas foram respondidas
    const totalQuestions = Object.keys(assessmentData.questions).reduce(
        (total, domainId) => total + assessmentData.questions[domainId].length, 0
    );
    
    if (Object.keys(currentState.responses).length < totalQuestions) {
        alert('Por favor, responda todas as perguntas antes de ver os resultados.');
        return;
    }

    // OTIMIZAÇÃO: Mostrar loading durante processamento pesado
    showLoading('Calculando resultados...');
    
    try {
        // OTIMIZAÇÃO: Usar requestAnimationFrame para não bloquear UI
        await new Promise(resolve => requestAnimationFrame(resolve));
        
        const results = calculateResults();
        
        // Esconder seção do questionário e mostrar resultados
        document.getElementById('questionnaireSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        // OTIMIZAÇÃO: Renderização assíncrona e progressiva
        showLoading('Renderizando resultados...');
        await renderResultsProgressively(results);
        
        // Scroll para os resultados
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Erro ao gerar resultados:', error);
        alert('Erro ao gerar resultados. Tente novamente.');
    } finally {
        hideLoading();
    }
}

// OTIMIZAÇÃO: Renderização progressiva para melhor UX
async function renderResultsProgressively(results) {
    // Renderizar componentes em etapas para não bloquear UI
    const renderSteps = [
        () => renderOverallScore(results),
        () => renderDomainCards(results.domainScores),
        () => renderTopGaps(results.topGaps),
        () => renderRecommendations(results.recommendations),
        () => renderChartsAsync(results)
    ];
    
    for (let i = 0; i < renderSteps.length; i++) {
        showLoading(`Renderizando resultados... ${i + 1}/${renderSteps.length}`);
        
        // OTIMIZAÇÃO: Usar requestAnimationFrame para renderização suave
        await new Promise(resolve => {
            requestAnimationFrame(() => {
                try {
                    renderSteps[i]();
                } catch (err) {
                    console.error('Erro ao renderizar etapa', i + 1, err);
                }
                resolve();
            });
        });
        
        // Pequena pausa para permitir que o browser processe
        await new Promise(resolve => setTimeout(resolve, 50));
    }
}

// Renderizar pontuação geral
function renderOverallScore(results) {
    document.getElementById('scoreValue').textContent = results.overallScore.toFixed(1);
    document.getElementById('levelText').textContent = results.maturityLevel.level;
    document.getElementById('levelDescription').textContent = results.maturityLevel.description;
    
    // Atualizar cor do círculo baseado no nível
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        scoreCircle.style.background = `linear-gradient(135deg, ${results.maturityLevel.color}, ${results.maturityLevel.color}dd)`;
    }

    // Atualizar CTA com níveis atual e desejável
    try {
        const currentSpan = document.getElementById('currentLevelX');
        const desiredSpan = document.getElementById('desiredLevelY');
        if (currentSpan && desiredSpan) {
            const levels = assessmentData.maturityLevels;
            const currentIndex = levels.findIndex(l => l.level === results.maturityLevel.level);
            const desired = currentIndex >= 0 && currentIndex < levels.length - 1
                ? levels[currentIndex + 1].level
                : levels[levels.length - 1].level;
            currentSpan.textContent = results.maturityLevel.level;
            desiredSpan.textContent = desired;
        }
    } catch {}
}

// Renderizar cards de domínios
function renderDomainCards(domainScores) {
    const container = document.getElementById('domainCards');
    container.innerHTML = '';

    Object.values(domainScores).forEach(domain => {
        const maturityLevel = getMaturityLevel(domain.score);
        const card = document.createElement('div');
        card.className = 'domain-card';
        card.style.borderLeftColor = maturityLevel.color;
        card.innerHTML = `
            <h4>${domain.icon} ${domain.name}</h4>
            <div class="domain-score" style="color: ${maturityLevel.color};">
                ${domain.score.toFixed(1)}/5.0
            </div>
            <div class="domain-level">${maturityLevel.level}</div>
        `;
        container.appendChild(card);
    });
}

// Renderizar top gaps
function renderTopGaps(topGaps) {
    const container = document.getElementById('gapsList');
    container.innerHTML = '';

    topGaps.forEach((gap, index) => {
        const item = document.createElement('div');
        item.className = 'gap-item';
        item.innerHTML = `
            <div class="gap-priority">Prioridade ${index + 1}</div>
            <div class="gap-text">
                ${gap.icon} <strong>${gap.domain}</strong> - 
                Pontuação atual: ${gap.score.toFixed(1)}/5.0 
                (Gap: ${gap.gap.toFixed(1)} pontos)
            </div>
        `;
        container.appendChild(item);
    });
}

// Renderizar recomendações
function renderRecommendations(recommendations) {
    const container = document.getElementById('recommendationsList');
    container.innerHTML = '';

    // Pegar top 10 recomendações mais importantes
    recommendations.slice(0, 10).forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <div class="recommendation-title">
                ${rec.domain.icon} ${rec.domain.name}
            </div>
            <div class="recommendation-text">${rec.recommendation}</div>
        `;
        container.appendChild(card);
    });
}

// OTIMIZAÇÃO: Renderização assíncrona de gráficos com PRE-CONFIGURAÇÃO para evitar layout shift infinito
async function renderChartsAsync(results) {
    showLoading('Preparando gráficos...');
    
    try {
        // CRÍTICO: Pre-configurar containers com dimensões FIXAS antes da renderização
        await preConfigureChartContainers();
        
        showLoading('Gerando gráficos...');
        
        // OTIMIZAÇÃO: Renderizar gráficos off-screen primeiro, depois mostrar
        await Promise.all([
            renderRadarChartOptimized(results.domainScores),
            renderBarChartOptimized(results.domainScores)
        ]);
        
        // CRÍTICO: Só mostrar os containers depois dos gráficos estarem prontos
        await showChartsAfterRender();
        
    } catch (error) {
        console.error('Erro ao renderizar gráficos:', error);
    }
}

// NOVA FUNÇÃO: Pre-configuração crítica dos containers para evitar layout shift infinito
async function preConfigureChartContainers() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            // CRÍTICO: Aplicar estilos anti-layout-shift aos containers
            applyAntiLayoutShiftStyles();
            
            // Container do gráfico radar - DIMENSÕES FIXAS
            const radarContainer = document.getElementById('radarChart')?.parentElement;
            if (radarContainer) {
                radarContainer.className += ' radar-chart-container';
                radarContainer.style.cssText += `
                    height: 400px !important;
                    min-height: 400px !important;
                    max-height: 400px !important;
                    width: 100% !important;
                    position: relative !important;
                    overflow: hidden !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    visibility: hidden !important;
                `;
            }
            
            // Container do gráfico de barras - DIMENSÕES FIXAS
            const barContainer = document.getElementById('barChart')?.parentElement;
            if (barContainer) {
                barContainer.className += ' bar-chart-container';
                barContainer.style.cssText += `
                    height: 400px !important;
                    min-height: 400px !important;
                    max-height: 400px !important;
                    width: 100% !important;
                    position: relative !important;
                    overflow: hidden !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                    visibility: hidden !important;
                `;
            }
            
            // Canvas com dimensões fixas para evitar redimensionamento
            const radarCanvas = document.getElementById('radarChart');
            if (radarCanvas) {
                radarCanvas.style.cssText += `
                    max-width: 400px !important;
                    max-height: 400px !important;
                    width: 100% !important;
                    height: 100% !important;
                `;
                radarCanvas.width = 400;
                radarCanvas.height = 400;
            }
            
            const barCanvas = document.getElementById('barChart');
            if (barCanvas) {
                barCanvas.style.cssText += `
                    max-width: 400px !important;
                    max-height: 400px !important;
                    width: 100% !important;
                    height: 100% !important;
                `;
                barCanvas.width = 400;
                barCanvas.height = 400;
            }
            
            resolve();
        });
    });
}

// NOVA FUNÇÃO: Aplicar estilos críticos anti-layout-shift diretamente no DOM
function applyAntiLayoutShiftStyles() {
    // Garantir que os estilos críticos estejam aplicados
    const criticalStyles = `
        .radar-chart-container, .bar-chart-container {
            height: 400px !important;
            min-height: 400px !important;
            max-height: 400px !important;
            width: 100% !important;
            position: relative !important;
            overflow: hidden !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: flex-start !important;
            background: var(--surface);
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        #radarChart, #barChart {
            max-width: 400px !important;
            max-height: 400px !important;
            width: 100% !important;
            height: 100% !important;
        }
    `;
    
    let criticalStyleElement = document.getElementById('critical-chart-styles');
    if (!criticalStyleElement) {
        criticalStyleElement = document.createElement('style');
        criticalStyleElement.id = 'critical-chart-styles';
        criticalStyleElement.textContent = criticalStyles;
        document.head.insertBefore(criticalStyleElement, document.head.firstChild);
    }
}

// Tema: alternância e atualização dos gráficos
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateChartTheme(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    const next = current === 'light' ? 'dark' : 'light';
    applyTheme(next);
    const btn = document.getElementById('themeToggle');
    if (btn) btn.textContent = next === 'dark' ? '🌙 Tema: Escuro' : '🌞 Tema: Claro';
}

function updateChartTheme(theme) {
    const isDark = theme === 'dark';
    const tick = isDark ? '#ffffff' : '#212529';
    const grid = isDark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.1)';
    const tooltipBg = isDark ? 'rgba(10,14,20,0.98)' : 'rgba(255,255,255,0.95)';
    const tooltipTxt = isDark ? '#ffffff' : '#212529';

    if (chartInstances.radarChart) {
        const r = chartInstances.radarChart.options.scales.r;
        r.ticks.color = tick;
        r.grid.color = grid;
        r.angleLines = Object.assign({}, r.angleLines || {}, { color: grid });
        r.pointLabels.color = tick;
        r.beginAtZero = true;
        // Legend/tooltip colors
        chartInstances.radarChart.options.plugins.legend = Object.assign({}, chartInstances.radarChart.options.plugins.legend || {}, {
            labels: Object.assign({}, (chartInstances.radarChart.options.plugins.legend||{}).labels || {}, { color: tick })
        });
        chartInstances.radarChart.options.plugins.tooltip = Object.assign({}, chartInstances.radarChart.options.plugins.tooltip || {}, {
            backgroundColor: tooltipBg,
            titleColor: tooltipTxt,
            bodyColor: tooltipTxt
        });
        chartInstances.radarChart.update('none');
    }
    if (chartInstances.barChart) {
        const x = chartInstances.barChart.options.scales.x;
        const y = chartInstances.barChart.options.scales.y;
        x.ticks.color = tick; x.grid.color = grid; x.border = Object.assign({}, x.border || {}, { color: grid });
        y.ticks.color = tick; y.grid.color = grid; y.border = Object.assign({}, y.border || {}, { color: grid });
        chartInstances.barChart.options.plugins.legend = Object.assign({}, chartInstances.barChart.options.plugins.legend || {}, {
            labels: Object.assign({}, (chartInstances.barChart.options.plugins.legend||{}).labels || {}, { color: tick })
        });
        chartInstances.barChart.options.plugins.tooltip = Object.assign({}, chartInstances.barChart.options.plugins.tooltip || {}, {
            backgroundColor: tooltipBg,
            titleColor: tooltipTxt,
            bodyColor: tooltipTxt
        });
        chartInstances.barChart.update('none');
    }
}

// NOVA FUNÇÃO: Mostrar gráficos apenas após renderização completa
async function showChartsAfterRender() {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            // Mostrar containers apenas depois de prontos
            const radarContainer = document.getElementById('radarChart')?.parentElement;
            if (radarContainer) {
                radarContainer.style.visibility = 'visible';
                radarContainer.style.opacity = '0';
                radarContainer.style.transition = 'opacity 0.5s ease-in-out';
                setTimeout(() => {
                    radarContainer.style.opacity = '1';
                }, 100);
            }
            
            const barContainer = document.getElementById('barChart')?.parentElement;
            if (barContainer) {
                barContainer.style.visibility = 'visible';
                barContainer.style.opacity = '0';
                barContainer.style.transition = 'opacity 0.5s ease-in-out';
                setTimeout(() => {
                    barContainer.style.opacity = '1';
                }, 100);
            }
            
            resolve();
        });
    });
}

// OTIMIZAÇÃO: Lazy loading e intersection observer para gráficos
function observeChartContainers() {
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const chartId = entry.target.id;
                if (chartId === 'radarChart' && !chartInstances.radarChart) {
                    renderRadarChartOptimized(currentState.results?.domainScores);
                } else if (chartId === 'barChart' && !chartInstances.barChart) {
                    renderBarChartOptimized(currentState.results?.domainScores);
                }
            }
        });
    }, { threshold: 0.1 });

    const radarChart = document.getElementById('radarChart');
    const barChart = document.getElementById('barChart');
    
    if (radarChart) chartObserver.observe(radarChart);
    if (barChart) chartObserver.observe(barChart);
}

// Gráfico radar OTIMIZADO - ANTI-LAYOUT-SHIFT: Dimensões fixas e renderização estável
async function renderRadarChartOptimized(domainScores) {
    if (!domainScores) return;
    
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            const canvas = document.getElementById('radarChart');
            if (!canvas) {
                resolve();
                return;
            }
            
            // CRÍTICO: Garantir dimensões fixas do canvas ANTES da criação do gráfico
            canvas.width = 400;
            canvas.height = 400;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.maxWidth = '400px';
            canvas.style.maxHeight = '400px';
            
            // OTIMIZAÇÃO: Destruir instância anterior para evitar memory leaks
            if (chartInstances.radarChart) {
                chartInstances.radarChart.destroy();
            }
            
            const ctx = canvas.getContext('2d');
            const labels = Object.values(domainScores).map(domain => domain.name);
            const data = Object.values(domainScores).map(domain => domain.score);
            
            // CRÍTICO: Configurações ANTI-LAYOUT-SHIFT para dimensões estáveis
            const config = {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Pontuação de Maturidade',
                        data: data,
                        borderColor: '#667eea',
                        backgroundColor: 'rgba(102, 126, 234, 0.12)',
                        pointBackgroundColor: '#667eea',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#667eea',
                        tension: 0.1
                    }]
                },
                options: {
                    // CRÍTICO: Desabilitar responsividade para evitar redimensionamentos
                    responsive: false,
                    maintainAspectRatio: true,
                    // CRÍTICO: Dimensões fixas explícitas
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20
                        }
                    },
                    // OTIMIZAÇÃO: Animações reduzidas para performance e estabilidade
                    animation: {
                        duration: 600,
                        easing: 'easeInOutQuart'
                    },
                    interaction: {
                        intersect: false,
                        mode: 'point'
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed.r.toFixed(1);
                                    const level = getMaturityLevel(context.parsed.r);
                                    return `${label}: ${value}/5.0 (${level.level})`;
                                }
                            }
                        }
                    },
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 5,
                            min: 0, // CRÍTICO: Fixar valores mínimo e máximo
                            pointLabels: {
                                font: {
                                    size: 11
                                },
                                padding: 10
                            },
                            // Ocultar números (1..5) nas linhas radiais para visual mais limpo
                            ticks: {
                                stepSize: 1,
                                display: false
                            },
                            grid: {
                                circular: true
                            }
                        }
                    }
                }
            };
            
            // CRÍTICO: Criar instância com configurações fixas
            chartInstances.radarChart = new Chart(ctx, config);
            // Aplicar tema atual
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            updateChartTheme(theme);
            
            // CRÍTICO: Forçar resize fixo após criação
            setTimeout(() => {
                if (chartInstances.radarChart) {
                    chartInstances.radarChart.resize(400, 400);
                }
                resolve();
            }, 100);
        });
    });
}

// Gráfico de barras OTIMIZADO - ANTI-LAYOUT-SHIFT: Dimensões fixas e renderização estável
async function renderBarChartOptimized(domainScores) {
    if (!domainScores) return;
    
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            const canvas = document.getElementById('barChart');
            if (!canvas) {
                resolve();
                return;
            }
            
            // CRÍTICO: Garantir dimensões fixas do canvas ANTES da criação do gráfico
            canvas.width = 400;
            canvas.height = 400;
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.maxWidth = '400px';
            canvas.style.maxHeight = '400px';
            
            // OTIMIZAÇÃO: Destruir instância anterior para evitar memory leaks
            if (chartInstances.barChart) {
                chartInstances.barChart.destroy();
            }
            
            const ctx = canvas.getContext('2d');
            const labels = Object.values(domainScores).map(domain => domain.name);
            const data = Object.values(domainScores).map(domain => domain.score);
            
            // OTIMIZAÇÃO: Cores pré-calculadas para performance
            const colors = data.map(score => {
                const level = getMaturityLevel(score);
                return {
                    background: level.color + '40',
                    border: level.color
                };
            });
            
            const config = {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Pontuação por Domínio',
                        data: data,
                        backgroundColor: colors.map(c => c.background),
                        borderColor: colors.map(c => c.border),
                        borderWidth: 2,
                        borderRadius: 4,
                        borderSkipped: false
                    }]
                },
                options: {
                    // CRÍTICO: Desabilitar responsividade para evitar redimensionamentos
                    responsive: false,
                    maintainAspectRatio: true,
                    // CRÍTICO: Dimensões fixas explícitas
                    layout: {
                        padding: {
                            top: 20,
                            bottom: 20,
                            left: 20,
                            right: 20
                        }
                    },
                    // OTIMIZAÇÃO: Animações reduzidas para performance e estabilidade
                    animation: {
                        duration: 600,
                        easing: 'easeInOutQuart'
                    },
                    interaction: {
                        intersect: false,
                        mode: 'index'
                    },
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                title: function(context) {
                                    return context[0].label;
                                },
                                label: function(context) {
                                    const value = context.parsed.y.toFixed(1);
                                    const level = getMaturityLevel(context.parsed.y);
                                    return `Pontuação: ${value}/5.0 (${level.level})`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5,
                            min: 0, // CRÍTICO: Fixar valores mínimo e máximo
                            ticks: {
                                stepSize: 1,
                                display: true
                            },
                            grid: {
                                color: 'rgba(0,0,0,0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                maxRotation: 45,
                                minRotation: 0,
                                display: true
                            },
                            grid: {
                                display: false
                            }
                        }
                    }
                }
            };
            
            // CRÍTICO: Criar instância com configurações fixas
            chartInstances.barChart = new Chart(ctx, config);
            // Aplicar tema atual
            const theme = document.documentElement.getAttribute('data-theme') || 'light';
            updateChartTheme(theme);
            
            // CRÍTICO: Forçar resize fixo após criação
            setTimeout(() => {
                if (chartInstances.barChart) {
                    chartInstances.barChart.resize(400, 400);
                }
                resolve();
            }, 100);
        });
    });
}

// OTIMIZAÇÃO: Função para atualizar dados dos gráficos sem recriar
function updateChartsData(domainScores) {
    if (chartInstances.radarChart && domainScores) {
        const data = Object.values(domainScores).map(domain => domain.score);
        chartInstances.radarChart.data.datasets[0].data = data;
        chartInstances.radarChart.update('none'); // Update sem animação para performance
    }
    
    if (chartInstances.barChart && domainScores) {
        const data = Object.values(domainScores).map(domain => domain.score);
        chartInstances.barChart.data.datasets[0].data = data;
        chartInstances.barChart.update('none'); // Update sem animação para performance
    }
}

// Geração de PDF OTIMIZADA - Processamento assíncrono com progress

// Reiniciar avaliação OTIMIZADO - Limpa recursos e memória
function restartAssessment() {
    if (confirm('Tem certeza que deseja iniciar uma nova avaliação? Todos os dados atuais serão perdidos.')) {
        // OTIMIZAÇÃO: Limpeza adequada de recursos
        cleanupResources();
        
        currentState = {
            currentDomain: 0,
            responses: {},
            results: null
        };
        
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('questionnaireSection').style.display = 'block';
        
        initializeApplication();
        
        // Scroll para o topo
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// OTIMIZAÇÃO: Limpeza de recursos e prevenção de memory leaks
function cleanupResources() {
    // Destruir instâncias de Chart.js
    if (chartInstances.radarChart) {
        chartInstances.radarChart.destroy();
        chartInstances.radarChart = null;
    }
    
    if (chartInstances.barChart) {
        chartInstances.barChart.destroy();
        chartInstances.barChart = null;
    }
    
    // Limpar observers se existirem
    if (window.chartObserver) {
        window.chartObserver.disconnect();
    }
}

// OTIMIZAÇÃO: Cleanup ao sair da página
window.addEventListener('beforeunload', () => {
    cleanupResources();
});

// OTIMIZAÇÃO: Performance monitoring e debugging
if (typeof performance !== 'undefined' && performance.mark) {
    // Marcar início da aplicação
    performance.mark('app-start');
    
    // Função para medir performance de operações críticas
    window.measurePerformance = function(name, fn) {
        performance.mark(`${name}-start`);
        const result = fn();
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
        
        // Log performance em desenvolvimento
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            const measures = performance.getEntriesByName(name);
            if (measures.length > 0) {
                console.log(`🎭 Performance [${name}]:`, `${measures[0].duration.toFixed(2)}ms`);
            }
        }
        
        return result;
    };
}

// OTIMIZAÇÃO: CSS e loading styles para melhor UX
const loadingStyles = `
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    backdrop-filter: blur(5px);
}

.loading-spinner {
    text-align: center;
    color: white;
}

.spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 20px;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    font-size: 16px;
    font-weight: 500;
    margin: 0;
    opacity: 0.9;
}

/* OTIMIZAÇÃO: Transições suaves para melhor UX */
.answer-option {
    transition: all 0.2s ease-in-out;
}

.answer-option:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.domain-tab {
    transition: all 0.3s ease;
}

.question-card {
    opacity: 0;
    animation: fadeInUp 0.6s ease forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* CRÍTICO: Anti-Layout-Shift - Containers com dimensões fixas */
.chart-container {
    contain: layout style paint;
    will-change: transform;
    height: 400px !important;
    min-height: 400px !important;
    max-height: 400px !important;
    width: 100% !important;
    position: relative !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
}

/* CRÍTICO: Canvas com dimensões fixas para evitar layout shift infinito */
#radarChart, #barChart {
    will-change: auto;
    max-width: 400px !important;
    max-height: 400px !important;
    width: 100% !important;
    height: 100% !important;
}

/* CRÍTICO: Container específico para cada gráfico */
.radar-chart-container, .bar-chart-container {
    height: 400px !important;
    min-height: 400px !important;
    max-height: 400px !important;
    width: 100% !important;
    position: relative !important;
    overflow: hidden !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
            background: var(--surface);
            border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

/* CRÍTICO: Loading state para gráficos */
.chart-loading {
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    height: 400px !important;
    background: #f9f9f9;
    border-radius: 8px;
    color: #666;
    font-size: 14px;
}

.chart-loading:before {
    content: "Carregando gráfico...";
    display: block;
}
`;

// Injetar estilos de loading se não existirem
if (!document.getElementById('performance-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'performance-styles';
    styleSheet.textContent = loadingStyles;
    document.head.appendChild(styleSheet);
}

// Renderizar legenda de níveis de maturidade
function renderMaturityLegend() {
    const container = document.getElementById("maturityLevelsGrid");
    container.innerHTML = "";

    assessmentData.maturityLevels.forEach((level, index) => {
        const levelCard = document.createElement("div");
        levelCard.className = "maturity-level";
        levelCard.innerHTML = `
            <div class="level-number">${index} – ${level.level}${index === 0 ? ' (ou Inexistente)' : ''}</div>
            <div class="level-full-description">
                <strong>Descrição:</strong> ${level.fullDescription}
            </div>
            <div class="level-example">
                <strong>Exemplo:</strong> ${level.example}
            </div>
        `;
        container.appendChild(levelCard);
    });
}


// Atualizar renderização dos cards de domínio com legendas curtas
function updateDomainCardsWithShortDescriptions() {
    const container = document.getElementById("domainCards");
    if (container && currentState.results) {
        const domainScores = currentState.results.domainScores;
        container.innerHTML = "";

        Object.values(domainScores).forEach(domain => {
            const maturityLevel = getMaturityLevel(domain.score);
            const card = document.createElement("div");
            card.className = "domain-card";
            card.style.borderLeftColor = maturityLevel.color;
            card.innerHTML = `
                <h4>${domain.icon} ${domain.name}</h4>
                <div class="domain-score" style="color: ${maturityLevel.color};">
                    ${domain.score.toFixed(1)}/5.0
                </div>
                <div class="domain-level">
                    ${maturityLevel.level} - <em>${maturityLevel.shortDescription}</em>
                </div>
            `;
            container.appendChild(card);
        });
    }
}

// Utilitário: converter imagem para DataURL
async function imageToDataURL(path) {
    const resp = await fetch(path);
    const blob = await resp.blob();
    return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
}

// Relatório com logomarca, gráficos e rodapé completo (pronto para impressão)
async function generatePDF() {
    if (!currentState.results) {
        alert("Nenhum resultado disponível para gerar relatório.");
        return;
    }

    showLoading("Preparando relatório para impressão...");

    try {
        const results = currentState.results;
        const levels = assessmentData.maturityLevels;
        const currentIndex = levels.findIndex(l => l.level === results.maturityLevel.level);
        const desiredLevel = currentIndex >= 0 && currentIndex < levels.length - 1
            ? levels[currentIndex + 1].level
            : levels[levels.length - 1].level;

        // Capturar gráficos como imagens
        const radarCanvas = document.getElementById('radarChart');
        const barCanvas = document.getElementById('barChart');
        const radarImg = radarCanvas ? radarCanvas.toDataURL('image/png') : null;
        const barImg = barCanvas ? barCanvas.toDataURL('image/png') : null;

        // Logomarca
        const logoDataUrl = await imageToDataURL('/image/logomarca_transp.png');

        const formatDomainScores = () => Object.values(results.domainScores)
            .map(d => {
                const level = getMaturityLevel(d.score);
                return `<li><strong>${d.name}</strong>: ${d.score.toFixed(1)}/5.0 (${level.level})</li>`;
            }).join("");

        const formatTopGaps = () => results.topGaps.slice(0, 5)
            .map((g, i) => `<li>${i + 1}. ${g.domain} — Gap: ${g.gap.toFixed(1)} pontos</li>`)
            .join("");

        const formatRecommendations = () => results.recommendations.slice(0, 8)
            .map((r, i) => `<li><strong>${i + 1}. ${r.domain.name}:</strong> ${r.recommendation}</li>`)
            .join("");

        const html = `<!DOCTYPE html>
        <html lang=\"pt-BR\"><head><meta charset=\"utf-8\" />
        <title>Relatório de Maturidade</title>
        <style>
        :root { --pink: #EB33CC; --text: #111; --muted: #555; }
        body { font-family: Arial, Helvetica, sans-serif; color: var(--text); background: #ffffff; padding: 28px; }
        header { display: flex; justify-content: center; margin-bottom: 12px; }
        header img { height: 40px; }
        h1 { font-size: 22px; margin: 8px 0 4px; }
        h2 { font-size: 16px; margin: 18px 0 8px; color: #222; }
        p, li { font-size: 13px; line-height: 1.55; }
        ul { padding-left: 18px; margin: 0; }
        .muted { color: var(--muted); }
        .card { border: 1px solid #ececec; border-radius: 10px; padding: 14px 16px; background: #fff; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .charts img { max-width: 380px; width: 100%; border: 1px solid #eee; border-radius: 8px; padding: 6px; background: #fff; }
        .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e5e5e5; font-size: 13px; }
        .cta { font-size: 14px; margin-bottom: 8px; }
        .contact { white-space: pre-line; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial; }
        @media print {
          body { padding: 20mm; }
          .grid { grid-template-columns: 1fr 1fr; }
          .charts img { break-inside: avoid; }
        }
        </style></head>
        <body>
            <header><img src="${logoDataUrl}" alt="PP Tech" /></header>
            <h1>Relatório de Maturidade em Segurança da Informação</h1>
            <p class=\"muted\">Data: ${new Date().toLocaleDateString('pt-BR')}</p>
            <div class="card">
              <h2>Resultado Geral</h2>
              <p><strong>Pontuação:</strong> ${results.overallScore}/5.0</p>
              <p><strong>Nível atual:</strong> ${results.maturityLevel.level}</p>
              <p><strong>Descrição:</strong> ${results.maturityLevel.description}</p>
            </div>
            <h2>Gráficos</h2>
            <div class="grid charts">
              <div>${radarImg ? `<img src="${radarImg}" alt="Radar por Domínio" />` : ''}</div>
              <div>${barImg ? `<img src="${barImg}" alt="Comparativo de Pontuações" />` : ''}</div>
            </div>
            <h2>Pontuações por Domínio</h2>
            <ul>${formatDomainScores()}</ul>
            <h2>Top 5 Prioridades</h2>
            <ul>${formatTopGaps()}</ul>
            <h2>Principais Recomendações</h2>
            <ul>${formatRecommendations()}</ul>
            <div class="footer">
              <p class="cta">Quer ver como sua empresa pode sair do nível <strong>${results.maturityLevel.level}</strong> para <strong>${desiredLevel}</strong>? Entre em contato.</p>
              <div class="contact">
contato@pereirapelizzari.tech
+55 11 3995 6390
Avenida Moema 170
12º andar - conjunto 125
04077-020
              </div>
            </div>
        </body></html>`;

        // Iframe oculto para imprimir (evita pop-ups)
        const iframe = document.createElement('iframe');
        iframe.style.position = 'fixed';
        iframe.style.right = '0';
        iframe.style.bottom = '0';
        iframe.style.width = '0';
        iframe.style.height = '0';
        iframe.style.border = '0';
        document.body.appendChild(iframe);
        const doc = iframe.contentWindow.document;
        doc.open();
        doc.write(html);
        doc.close();
        setTimeout(() => {
            iframe.contentWindow.focus();
            iframe.contentWindow.print();
            setTimeout(() => document.body.removeChild(iframe), 1000);
        }, 400);
    } catch (error) {
        console.error('Erro ao gerar relatório para impressão:', error);
        alert('Erro ao gerar relatório. Tente novamente.');
    } finally {
        hideLoading();
    }
}

// Funções para controlar a seção de metodologia
function startAssessment() {
    const methodology = document.getElementById('methodologySection');
    const questionnaire = document.getElementById('questionnaireSection');
    const progress = document.getElementById('progressContainer');
    if (methodology) methodology.style.display = 'none';
    if (progress) progress.style.display = 'block';
    if (questionnaire) questionnaire.style.display = 'block';

    // Garantir renderização inicial do questionário
    try {
        renderDomainTabs();
        renderCurrentDomain();
        updateProgress();
        updateNavigation();
    } catch (e) {
        // fallback: re-inicializar fluxo
        try { initializeApplication(); } catch {}
    }

    document.getElementById('questionnaireSection').scrollIntoView({ behavior: 'smooth' });
}
