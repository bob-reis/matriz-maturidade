// Dados estruturados do questionário de maturidade em segurança
const assessmentData = {
    key: "cis-lite-v1",
    version: 1,
    domains: [
        {
            id: "gov",
            name: "Governança & Risco",
            weight: 1.0,
            description: "Políticas, processos e estruturas de governança em segurança da informação",
            icon: "🏛️"
        },
        {
            id: "iam",
            name: "Identidades & Acessos",
            weight: 1.2,
            description: "Gerenciamento de identidades, autenticação e controle de acesso",
            icon: "🔐"
        },
        {
            id: "data",
            name: "Dados & LGPD",
            weight: 1.1,
            description: "Proteção de dados, classificação e conformidade com LGPD",
            icon: "🛡️"
        },
        {
            id: "appsec",
            name: "AppSec/DevSecOps",
            weight: 1.3,
            description: "Segurança no desenvolvimento e DevSecOps",
            icon: "💻"
        },
        {
            id: "cloud",
            name: "Infra/Cloud",
            weight: 1.2,
            description: "Segurança da infraestrutura e ambientes cloud",
            icon: "☁️"
        },
        {
            id: "secops",
            name: "Detecção & Resposta",
            weight: 1.3,
            description: "Monitoramento, detecção e resposta a incidentes",
            icon: "🚨"
        },
        {
            id: "awareness",
            name: "Conscientização",
            weight: 0.9,
            description: "Treinamento e conscientização em segurança",
            icon: "🎓"
        },
        {
            id: "bcdr",
            name: "Continuidade & Resiliência",
            weight: 1.0,
            description: "Continuidade de negócios e recuperação de desastres",
            icon: "🔄"
        }
    ],
    choices: [
        { label: "Não", value: 0, description: "Não implementado ou inexistente" },
        { label: "Parcial", value: 2, description: "Parcialmente implementado" },
        { label: "Sim", value: 5, description: "Totalmente implementado" }
    ],
    questions: {
        gov: [
            {
                id: "gov_1",
                text: "Política de segurança aprovada e comunicada?",
                weight: 2,
                recommendation: "Desenvolva uma política de segurança abrangente, aprovada pela alta direção e comunicada a todos os colaboradores."
            },
            {
                id: "gov_2",
                text: "Fornecedores críticos passam por avaliação de risco periódica?",
                weight: 2,
                recommendation: "Implemente processo formal de due diligence e avaliação contínua de riscos dos fornecedores críticos."
            },
            {
                id: "gov_3",
                text: "Existe inventário de ativos atualizado e classificado?",
                weight: 2,
                recommendation: "Mantenha inventário completo e atualizado de todos os ativos, com classificação baseada na criticidade para o negócio."
            },
            {
                id: "gov_4",
                text: "Há processo formal de gestão de riscos de segurança?",
                weight: 3,
                recommendation: "Estabeleça metodologia formal de identificação, avaliação, tratamento e monitoramento de riscos de segurança."
            },
            {
                id: "gov_5",
                text: "Comitê de segurança se reúne regularmente?",
                weight: 2,
                recommendation: "Forme comitê executivo de segurança com reuniões regulares para governança e tomada de decisões estratégicas."
            },
            {
                id: "gov_6",
                text: "Auditorias internas de segurança realizadas ao menos 1x/ano?",
                weight: 3,
                recommendation: "Conduza auditorias internas regulares para verificar conformidade com políticas e identificar gaps de segurança."
            }
        ],
        iam: [
            {
                id: "iam_1",
                text: "MFA em 100% dos usuários privilegiados?",
                weight: 3,
                recommendation: "Aplique MFA para 100% dos usuários, priorizando contas privilegiadas e acesso a sistemas críticos."
            },
            {
                id: "iam_2",
                text: "Revisão trimestral de acessos e recertificação?",
                weight: 2,
                recommendation: "Implemente processo de revisão e recertificação de acessos pelos gestores a cada trimestre."
            },
            {
                id: "iam_3",
                text: "Contas privilegiadas usam cofre de senhas/rotatividade?",
                weight: 2,
                recommendation: "Utilize solução de PAM (Privileged Access Management) com rotação automática de senhas privilegiadas."
            },
            {
                id: "iam_4",
                text: "Implementado princípio de menor privilégio e RBAC?",
                weight: 2,
                recommendation: "Adote RBAC com privilégios mínimos e segregação de funções para reduzir a superfície de risco."
            },
            {
                id: "iam_5",
                text: "Provisionamento e desprovisionamento automatizados?",
                weight: 1,
                recommendation: "Automatize ciclo de vida de identidades (onboarding/offboarding) integrado a diretórios e HR."
            },
            {
                id: "iam_6",
                text: "Senhas robustas com política de complexidade?",
                weight: 1,
                recommendation: "Defina requisitos de senhas robustas e aplique checagem contra listas de senhas vazadas."
            }
        ],
        data: [
            {
                id: "data_1",
                text: "Dados classificados por sensibilidade e impacto?",
                weight: 2,
                recommendation: "Classifique dados por níveis (público, interno, confidencial) e aplique controles por nível."
            },
            {
                id: "data_2",
                text: "Mapeamento de dados pessoais (inventário LGPD)?",
                weight: 2,
                recommendation: "Mantenha inventário de dados pessoais, bases legais e fluxos, com responsáveis definidos (LGPD)."
            },
            {
                id: "data_3",
                text: "Controles de DLP para e-mail e endpoints?",
                weight: 2,
                recommendation: "Implemente DLP para canais críticos (e-mail, endpoints, cloud) com políticas conforme classificação."
            },
            {
                id: "data_4",
                text: "Criptografia em repouso e trânsito para dados sensíveis?",
                weight: 3,
                recommendation: "Aplique criptografia forte em repouso e trânsito para dados sensíveis (TLS 1.2+, AES-256)."
            },
            {
                id: "data_5",
                text: "Mascaramento e anonimização onde necessário?",
                weight: 1,
                recommendation: "Aplique mascaramento/anonymização para ambientes de teste e compartilhamento de dados."
            },
            {
                id: "data_6",
                text: "Retenção e descarte seguro com política definida?",
                weight: 1,
                recommendation: "Defina política de retenção e descarte seguro com auditoria e mecanismos de revisão."
            }
        ],
        appsec: [
            {
                id: "appsec_1",
                text: "Pipeline CI com SAST/Dependency Scan?",
                weight: 2,
                recommendation: "Configure SAST, análise de dependências e licenças no pipeline de CI."
            },
            {
                id: "appsec_2",
                text: "Revisão de código com foco em segurança?",
                weight: 2,
                recommendation: "Inclua checklist de segurança em code reviews (OWASP Top 10, CWE)."
            },
            {
                id: "appsec_3",
                text: "Secrets management centralizado e seguro?",
                weight: 2,
                recommendation: "Gerencie segredos em cofre seguro, com rotação e acesso auditado."
            },
            {
                id: "appsec_4",
                text: "Testes DAST e cobertura em ambientes?",
                weight: 2,
                recommendation: "Execute DAST em ambientes de teste/staging com cobertura periódica e rastreabilidade."
            },
            {
                id: "appsec_5",
                text: "SBOM e verificação de integridade nas releases?",
                weight: 2,
                recommendation: "Gere SBOM e verifique integridade (assinatura) nas entregas."
            },
            {
                id: "appsec_6",
                text: "Threat modeling nas funcionalidades críticas?",
                weight: 2,
                recommendation: "Realize threat modeling em features críticas e integre achados ao backlog."
            }
        ],
        cloud: [
            {
                id: "cloud_1",
                text: "Hardening em IaaS/PaaS com baseline?",
                weight: 2,
                recommendation: "Aplique baseline de hardening (CIS Benchmarks) nos serviços e máquinas."
            },
            {
                id: "cloud_2",
                text: "Segregação de ambientes e contas?",
                weight: 2,
                recommendation: "Separe ambientes (dev/test/prod) e use contas/projetos distintos com políticas dedicadas."
            },
            {
                id: "cloud_3",
                text: "Controle de custos e tagging para rastreabilidade?",
                weight: 1,
                recommendation: "Implemente tagging e políticas de custos com alertas e rastreabilidade."
            },
            {
                id: "cloud_4",
                text: "Backups, snapshots e testes de restauração periódicos?",
                weight: 2,
                recommendation: "Mantenha backups e snapshots com testes de restauração regulares."
            },
            {
                id: "cloud_5",
                text: "Network security (WAF/SG/NACL) padronizada?",
                weight: 2,
                recommendation: "Padronize WAF/SG/NACL com regras mínimas, revisão e automação onde possível."
            },
            {
                id: "cloud_6",
                text: "Monitoração e alertas de configuração (CSPM)?",
                weight: 2,
                recommendation: "Implemente CSPM para monitorar desvios de configuração e conformidade."
            }
        ],
        secops: [
            {
                id: "secops_1",
                text: "Centralização de logs e correlação (SIEM)?",
                weight: 2,
                recommendation: "Centralize logs e use SIEM para correlação e detecção."
            },
            {
                id: "secops_2",
                text: "Playbooks de resposta e testes de mesa?",
                weight: 2,
                recommendation: "Documente playbooks e realize tabletop exercises periodicamente."
            },
            {
                id: "secops_3",
                text: "Vulnerability management com SLA por criticidade?",
                weight: 2,
                recommendation: "Implemente gestão de vulnerabilidades com SLA e priorização baseada em risco."
            },
            {
                id: "secops_4",
                text: "Monitoramento de endpoints (EDR) implantado?",
                weight: 2,
                recommendation: "Adote EDR nos endpoints com alertas e resposta."
            },
            {
                id: "secops_5",
                text: "Análise de incidentes e lições aprendidas?",
                weight: 2,
                recommendation: "Realize post-mortems e incorpore lições aprendidas aos processos."
            },
            {
                id: "secops_6",
                text: "Simulações/Red Team em sistemas críticos?",
                weight: 2,
                recommendation: "Execute simulações/ataques (Red Team) e melhore controles com base nos achados."
            }
        ],
        awareness: [
            {
                id: "awareness_1",
                text: "Simulações de phishing com feedback por função?",
                weight: 2,
                recommendation: "Execute campanhas simuladas de phishing por função com microtreinamentos corretivos personalizados."
            },
            {
                id: "awareness_2",
                text: "Onboarding/offboarding com checklist de segurança?",
                weight: 2,
                recommendation: "Inclua checklist de segurança nos processos de onboarding e offboarding de colaboradores."
            },
            {
                id: "awareness_3",
                text: "Treinamentos anuais obrigatórios de segurança?",
                weight: 2,
                recommendation: "Implemente treinamento anual obrigatório de conscientização em segurança para todos os colaboradores."
            },
            {
                id: "awareness_4",
                text: "Treinamentos específicos por função (dev, suporte, vendas)?",
                weight: 2,
                recommendation: "Desenvolva treinamentos específicos de segurança adaptados para cada função/departamento."
            },
            {
                id: "awareness_5",
                text: "Comunicações periódicas de segurança (newsletter, intranet)?",
                weight: 1,
                recommendation: "Mantenha comunicação regular sobre segurança através de newsletters, intranet ou outros canais internos."
            },
            {
                id: "awareness_6",
                text: "Campanhas de conscientização com gamificação/premiação?",
                weight: 1,
                recommendation: "Implemente campanhas de conscientização com elementos de gamificação e sistemas de reconhecimento."
            }
        ],
        bcdr: [
            {
                id: "bcdr_1",
                text: "RTO/RPO definidos por sistema e testados?",
                weight: 3,
                recommendation: "Defina RTO/RPO para cada sistema crítico e valide através de testes regulares de recuperação."
            },
            {
                id: "bcdr_2",
                text: "DR testado no último ano?",
                weight: 3,
                recommendation: "Execute testes completos de Disaster Recovery ao menos anualmente com documentação de resultados."
            },
            {
                id: "bcdr_3",
                text: "BCP formalizado e comunicado aos times críticos?",
                weight: 2,
                recommendation: "Formalize Business Continuity Plan e comunique procedimentos para todas as equipes críticas."
            },
            {
                id: "bcdr_4",
                text: "Teste de failover em sistemas críticos nos últimos 12 meses?",
                weight: 3,
                recommendation: "Conduza testes de failover em todos os sistemas críticos com documentação de tempos e procedimentos."
            },
            {
                id: "bcdr_5",
                text: "Exercícios de crise/cenários de indisponibilidade simulados?",
                weight: 2,
                recommendation: "Realize exercícios de gerenciamento de crise simulando diferentes cenários de indisponibilidade."
            },
            {
                id: "bcdr_6",
                text: "Inventário de contatos e fornecedores de contingência disponível?",
                weight: 1,
                recommendation: "Mantenha inventário atualizado de contatos emergenciais e fornecedores alternativos para continuidade."
            }
        ]
    },
    maturityLevels: [
        {
            level: "Inicial",
            range: [0, 0.9],
            description: "Práticas de segurança inexistentes ou completamente ad-hoc",
            shortDescription: "Improviso",
            fullDescription: "Não há práticas formais de segurança. Se existem, são ad-hoc, dependem de pessoas específicas.",
            example: "Não existe política de senhas, cada equipe decide a sua forma.",
            color: "#dc3545",
            icon: "🔴"
        },
        {
            level: "Repetível",
            range: [1.0, 1.9],
            description: "Práticas existem em alguns setores, mas sem uniformidade",
            shortDescription: "Faz, mas cada um do seu jeito",
            fullDescription: "Algumas práticas existem e já são repetidas de forma parecida em mais de um time, mas ainda sem formalização completa.",
            example: "Equipe de TI sempre pede MFA para admins, mas não existe política oficial para toda a empresa.",
            color: "#fd7e14",
            icon: "🟠"
        },
        {
            level: "Definido",
            range: [2.0, 2.9],
            description: "Processos formalizados e documentados",
            shortDescription: "Política documentada, implementação parcial",
            fullDescription: "Processos formalizados e documentados. Existe política, norma, procedimento. Todos conhecem a regra, mas pode faltar consistência ou métricas.",
            example: "Política de senhas definida e publicada, mas ainda não há auditoria contínua para garantir cumprimento.",
            color: "#ffc107",
            icon: "🟡"
        },
        {
            level: "Gerenciado",
            range: [3.0, 3.9],
            description: "Segurança monitorada, medida e auditada",
            shortDescription: "Mede, audita, cobra resultado",
            fullDescription: "Segurança monitorada e medida. Controles têm KPIs e são auditados. Existe governança e acompanhamento por gestão.",
            example: "MFA obrigatório em 100% dos acessos, revisado trimestralmente, com relatórios para a direção.",
            color: "#20c997",
            icon: "🟢"
        },
        {
            level: "Otimizado",
            range: [4.0, 5.0],
            description: "Segurança é cultura organizacional com melhoria contínua",
            shortDescription: "Automatiza, melhora sempre, cultura enraizada",
            fullDescription: "Segurança é cultura. Processos passam por melhoria contínua e são adaptados ao negócio. Existe automação, métricas avançadas e integração com a estratégia da empresa.",
            example: "Revisão de acessos é automática, com integração ao AD e alertas de risco; melhorias são feitas de forma proativa.",
            color: "#28a745",
            icon: "🌟"
        }
    ]
};

