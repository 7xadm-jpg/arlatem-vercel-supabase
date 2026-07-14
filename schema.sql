-- ARLATEM | Supabase schema + seed
-- Rode este arquivo no SQL Editor do Supabase.

create table if not exists public.site_store (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_site_store_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_site_store_updated_at on public.site_store;
create trigger trg_site_store_updated_at
before update on public.site_store
for each row execute function public.touch_site_store_updated_at();

insert into storage.buckets (id, name, public)
values ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- Opcional, mas recomendado para leitura pública das imagens do bucket.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'Public read site-assets'
  ) then
    create policy "Public read site-assets"
      on storage.objects for select
      using (bucket_id = 'site-assets');
  end if;
end $$;

insert into public.site_store (key, value)
values
  ('content', $json${
  "settings": {
    "siteName": "ARLATEM",
    "tagline": "ARLA 32 • SCR • Linha Pesada",
    "whatsappNumber": "5531000000000",
    "email": "contato@arlatem.com.br",
    "instagram": "#",
    "facebook": "#",
    "location": "Belo Horizonte - MG",
    "hours": "Seg a Sex • 08h às 18h",
    "copyrightText": "ARLATEM. Todos os direitos reservados.",
    "adminPath": "/acesso-tecnico-arlatem"
  },
  "hero": {
    "eyebrow": "Catálogo profissional para ARLA 32 e pós-tratamento diesel",
    "title": "Tudo para o Sistema de ARLA do seu Caminhão.",
    "subtitle": "Bombas, módulos, sensores NOx, dosadores, filtros, catalisadores, chicotes e componentes de alta performance para linha pesada.",
    "backgroundImage": "/uploads/hero-trucks-arla.png",
    "searchPlaceholder": "Pesquisar por Sensor NOx, Bomba ARLA, Catalisador, Dosador, Chicote, Filtro, Módulo, Válvula..."
  },
  "highlights": [
    "Peças Originais",
    "Atendimento Especializado",
    "Produtos Testados",
    "Suporte Técnico",
    "Envio para Todo Brasil"
  ],
  "categories": [
    {
      "name": "Bombas ARLA",
      "description": "Pressão e alimentação do sistema",
      "icon": "pump"
    },
    {
      "name": "Sensores NOx",
      "description": "Leitura precisa das emissões",
      "icon": "sensor"
    },
    {
      "name": "Catalisadores",
      "description": "Eficiência no pós-tratamento",
      "icon": "grid"
    },
    {
      "name": "Dosadores",
      "description": "Injeção controlada de ARLA",
      "icon": "doser"
    },
    {
      "name": "Filtros",
      "description": "Proteção e durabilidade",
      "icon": "filter"
    },
    {
      "name": "Módulos",
      "description": "Controle eletrônico do sistema",
      "icon": "chip"
    },
    {
      "name": "Chicotes",
      "description": "Conectividade elétrica confiável",
      "icon": "cable"
    },
    {
      "name": "Reservatórios",
      "description": "Armazenamento e vedação",
      "icon": "tank"
    },
    {
      "name": "Tubulações",
      "description": "Linhas de alimentação e retorno",
      "icon": "pipe"
    },
    {
      "name": "Peças Pneumáticas",
      "description": "Controle e acionamento auxiliar",
      "icon": "plus"
    },
    {
      "name": "Kits de Reparo",
      "description": "Manutenção ágil e inteligente",
      "icon": "repair"
    },
    {
      "name": "Acessórios",
      "description": "Complementos e soluções técnicas",
      "icon": "shield"
    }
  ],
  "brands": [
    {
      "name": "Mercedes"
    },
    {
      "name": "Volvo"
    },
    {
      "name": "Scania"
    },
    {
      "name": "DAF"
    },
    {
      "name": "MAN"
    },
    {
      "name": "Volkswagen"
    },
    {
      "name": "Ford"
    },
    {
      "name": "Iveco"
    },
    {
      "name": "Renault"
    },
    {
      "name": "Agrale"
    }
  ],
  "benefits": [
    {
      "title": "Peças Originais",
      "text": "Itens originais, homologados e selecionados para aplicações exigentes.",
      "icon": "check"
    },
    {
      "title": "Envio para Todo Brasil",
      "text": "Atendimento nacional com logística eficiente e comunicação ágil.",
      "icon": "truck"
    },
    {
      "title": "Atendimento Especializado",
      "text": "Equipe preparada para apoiar a escolha correta da peça por aplicação.",
      "icon": "support"
    },
    {
      "title": "Qualidade Garantida",
      "text": "Processos orientados para durabilidade, confiabilidade e performance.",
      "icon": "doc"
    },
    {
      "title": "Suporte Técnico",
      "text": "Orientação para sintomas, códigos e compatibilidades do sistema SCR.",
      "icon": "clock"
    },
    {
      "title": "Produtos Testados",
      "text": "Mais segurança para oficinas, frotistas e operações de alta demanda.",
      "icon": "verified"
    }
  ],
  "banner": {
    "eyebrow": "Suporte comercial rápido",
    "title": "Não encontrou sua peça?",
    "subtitle": "Nossa equipe encontra para você com base no código, chassi, montadora ou aplicação."
  },
  "about": {
    "title": "Especialistas em ARLA 32, SCR e pós-tratamento diesel para linha pesada",
    "paragraph1": "A ARLATEM foi pensada para atender quem precisa de rapidez, segurança técnica e assertividade na compra de componentes para sistemas de emissões.",
    "paragraph2": "Nosso foco está em facilitar a jornada de oficinas, transportadoras, frotistas e compradores técnicos, com catálogo organizado, atendimento especializado e conversão direta via WhatsApp.",
    "points": [
      "Busca por código, peça ou veículo",
      "Curadoria técnica para aplicações complexas",
      "Experiência digital premium e objetiva"
    ],
    "specs": [
      {
        "label": "Foco principal",
        "value": "Conversão em orçamentos"
      },
      {
        "label": "Público atendido",
        "value": "Frotistas, oficinas e transportadoras"
      },
      {
        "label": "Segmento",
        "value": "ARLA, SCR e pós-tratamento diesel"
      },
      {
        "label": "Atuação",
        "value": "Envio para todo o Brasil"
      },
      {
        "label": "Experiência",
        "value": "Catálogo rápido e intuitivo"
      }
    ]
  },
  "blog": [
    {
      "tag": "SCR",
      "title": "Como funciona o sistema SCR",
      "excerpt": "Entenda os principais componentes, o papel do ARLA 32 e como o pós-tratamento reduz emissões."
    },
    {
      "tag": "Sensor NOx",
      "title": "Quando trocar o Sensor NOx",
      "excerpt": "Os sinais mais comuns de falha, sintomas no painel e o impacto no desempenho do caminhão."
    },
    {
      "tag": "Diagnóstico",
      "title": "Como identificar falhas no ARLA",
      "excerpt": "Veja como cruzar código, aplicação e sintomas para escolher o componente correto."
    },
    {
      "tag": "Catalisador",
      "title": "Catalisador entupido: principais causas",
      "excerpt": "Descubra os riscos operacionais e como agir antes que a falha comprometa a frota."
    },
    {
      "tag": "SCR",
      "title": "Erros mais comuns do sistema SCR",
      "excerpt": "Falhas recorrentes em sensores, dosadores, bombas e módulos que afetam a operação."
    },
    {
      "tag": "Manutenção",
      "title": "Manutenção preventiva em pós-tratamento",
      "excerpt": "Boas práticas para prolongar a vida útil dos componentes e evitar paradas não programadas."
    }
  ],
  "testimonials": [
    {
      "quote": "Encontramos o sensor NOx certo em poucos minutos. O atendimento foi objetivo e técnico, exatamente o que precisamos na rotina da oficina.",
      "author": "Carlos Henrique",
      "role": "Oficina Diesel • Belo Horizonte",
      "stars": 5
    },
    {
      "quote": "O catálogo é rápido, claro e ajuda muito a filtrar por aplicação. O orçamento via WhatsApp agilizou toda a compra para nossa frota.",
      "author": "Juliana Azevedo",
      "role": "Gestora de Frota • Transportadora",
      "stars": 5
    },
    {
      "quote": "Excelente experiência para localizar bomba de ARLA e dosador. Visual profissional e sensação de empresa sólida.",
      "author": "Márcio Fernandes",
      "role": "Comprador Técnico • Frotista",
      "stars": 5
    }
  ],
  "faq": [
    {
      "question": "Vocês enviam para todo Brasil?",
      "answer": "Sim. Atendemos clientes de todo o país com suporte comercial e logística orientada para envio rápido."
    },
    {
      "question": "Como solicitar orçamento?",
      "answer": "Basta clicar em qualquer botão de WhatsApp no site e informar a peça, o código ou o veículo desejado."
    },
    {
      "question": "Trabalham com peças originais?",
      "answer": "Sim. Trabalhamos com itens originais, homologados e linhas de alta qualidade, conforme a necessidade da aplicação."
    },
    {
      "question": "Possuem garantia?",
      "answer": "Sim. Os produtos possuem garantia conforme política do fabricante e categoria da peça."
    },
    {
      "question": "Vendem para oficinas?",
      "answer": "Sim. Atendemos oficinas, transportadoras, frotistas e compradores técnicos de manutenção diesel."
    }
  ]
}$json$::jsonb),
  ('products', $json$[
  {
    "id": 1,
    "name": "Sensor NOx Pós-Catalisador Euro 6",
    "code": "ARL-NOX-7842",
    "brand": "Continental",
    "compatibility": "Mercedes Actros / Arocs / Axor",
    "category": "Sensores NOx",
    "model": "Actros 2548",
    "montadora": "Mercedes",
    "year": "2019+",
    "motor": "OM 471",
    "manufacturer": "Continental",
    "availability": "Pronta entrega",
    "tags": [
      "Sensor NOx",
      "Euro 6",
      "Pós-Catalisador"
    ],
    "description": "Componente para leitura precisa de emissões no sistema SCR, com alta estabilidade térmica e comunicação confiável.",
    "applications": "Linha pesada Mercedes-Benz com sistema Euro 6.",
    "warranty": "Garantia conforme fabricante",
    "image": ""
  },
  {
    "id": 2,
    "name": "Bomba de ARLA Completa com Módulo",
    "code": "ARL-BMB-4521",
    "brand": "Bosch",
    "compatibility": "Volvo FH / FM",
    "category": "Bombas ARLA",
    "model": "FH 540",
    "montadora": "Volvo",
    "year": "2018+",
    "motor": "D13K",
    "manufacturer": "Bosch",
    "availability": "Pronta entrega",
    "tags": [
      "Bomba ARLA",
      "Módulo",
      "SCR"
    ],
    "description": "Conjunto completo para alimentação e pressurização do ARLA 32, pronto para integração com o sistema.",
    "applications": "Aplicações Volvo FH e FM com SCR.",
    "warranty": "Garantia conforme fabricante",
    "image": ""
  },
  {
    "id": 3,
    "name": "Catalisador SCR Alta Eficiência",
    "code": "ARL-CAT-6690",
    "brand": "Cummins",
    "compatibility": "Scania R / G / P Series",
    "category": "Catalisadores",
    "model": "R 450",
    "montadora": "Scania",
    "year": "2017+",
    "motor": "DC13",
    "manufacturer": "Cummins",
    "availability": "Sob encomenda",
    "tags": [
      "Catalisador",
      "SCR",
      "Emissões"
    ],
    "description": "Elemento catalítico projetado para alta eficiência de conversão e longa vida útil em operações severas.",
    "applications": "Scania série R com pós-tratamento SCR.",
    "warranty": "Garantia conforme fabricante",
    "image": ""
  },
  {
    "id": 4,
    "name": "Dosador de ARLA com Aquecimento Integrado",
    "code": "ARL-DOS-1089",
    "brand": "WABCO",
    "compatibility": "DAF XF / CF",
    "category": "Dosadores",
    "model": "XF 480",
    "montadora": "DAF",
    "year": "2020+",
    "motor": "MX-13",
    "manufacturer": "WABCO",
    "availability": "Pronta entrega",
    "tags": [
      "Dosador",
      "Aquecimento",
      "ARLA"
    ],
    "description": "Dosagem precisa do reagente com resposta rápida e excelente resistência a variações térmicas.",
    "applications": "DAF XF e CF com sistemas SCR modernos.",
    "warranty": "Garantia conforme fabricante",
    "image": ""
  },
  {
    "id": 5,
    "name": "Filtro de ARLA de Alta Retenção",
    "code": "ARL-FLT-3310",
    "brand": "Knorr-Bremse",
    "compatibility": "Volkswagen Constellation / MAN TGX",
    "category": "Filtros",
    "model": "Constellation 25.460",
    "montadora": "Volkswagen",
    "year": "2018+",
    "motor": "MAN D26",
    "manufacturer": "Knorr-Bremse",
    "availability": "Pronta entrega",
    "tags": [
      "Filtro",
      "Retenção",
      "Linha Pesada"
    ],
    "description": "Filtro técnico para proteção do circuito de ARLA e aumento de confiabilidade do sistema.",
    "applications": "VW Constellation e modelos MAN com SCR.",
    "warranty": "Garantia conforme fabricante",
    "image": ""
  },
  {
    "id": 6,
    "name": "Módulo de Controle SCR",
    "code": "ARL-MOD-8715",
    "brand": "ZF",
    "compatibility": "Ford Cargo / Iveco Hi-Way",
    "category": "Módulos",
    "model": "Cargo 2429",
    "montadora": "Ford",
    "year": "2016+",
    "motor": "Cummins ISL",
    "manufacturer": "ZF",
    "availability": "Sob encomenda",
    "tags": [
      "Módulo",
      "Controle",
      "SCR"
    ],
    "description": "Módulo para gerenciamento eletrônico do pós-tratamento com comunicação robusta e diagnóstico avançado.",
    "applications": "Ford Cargo e aplicações correlatas.",
    "warranty": "Garantia conforme fabricante",
    "image": ""
  }
]$json$::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();
