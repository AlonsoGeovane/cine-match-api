import { v4 as uuidv4 } from 'uuid';
import { database } from '../src/config/database.js';
import { Questions } from '../src/models/Questions.js';

const questionsData = [
    {
        text: 'Como você está se sentindo hoje?',
        options: [
            {
                label: 'Animado (Action, Adventure)',
                value: 'Animado (Action, Adventure)',
                emoji: "⚡"
            },
            {
                label: 'Pensativo (Drama, Mystery)',
                value: 'Pensativo (Drama, Mystery)',
                emoji: "🤔"
            },
            {
                label: 'Empolgado (Science Fiction, Thriller)',
                value: 'Empolgado (Science Fiction, Thriller)',
                emoji: "🤩"
            },
            {
                label: 'Romântico (Romance, Comedy)',
                value: 'Romântico (Romance, Comedy)',
                emoji: "🥰"
            },
            {
                label: 'Assustado (Horror)',
                value: 'Assustado (Horror)',
                emoji: "😱"
            },
            {
                label: 'Curioso (Documentary, History)',
                value: 'Curioso (Documentary, History)',
                emoji: "🤓"
            },

        ]
    },
    {
        text: 'Quais gêneros você mais gosta?',
        options: [
            {
                label: 'Ação',
                value: 'Action',
                emoji: "💥"
            },
            {
                label: 'Aventura',
                value: 'Adventure',
                emoji: "🏹"
            },
            {
                label: 'Comédia',
                value: 'Comedy',
                emoji: "🤣"
            },
            {
                label: 'Drama',
                value: 'Drama',
                emoji: "🎭"
            },
            {
                label: 'Terror',
                value: 'Horror',
                emoji: "🩻"
            },
            {
                label: 'Romance',
                value: 'Romance',
                emoji: "💘"
            },
            {
                label: 'Ficção Científica',
                value: 'Science Fiction',
                emoji: "👽"
            },
            {
                label: 'Suspense',
                value: 'Thriller',
                emoji: "⏳"
            },
            {
                label: 'Fantasia',
                value: 'Fantasy',
                emoji: "🧙‍♂️"
            },
            {
                label: 'Mistério',
                value: 'Mystery',
                emoji: "🔍"
            },
            {
                label: 'Animação',
                value: 'Animation',
                emoji: "🧸"
            },
            {
                label: 'Crime',
                value: 'Crime',
                emoji: "👮"
            },
        ]
    },
    {
        text: 'Em quais idiomas você prefere assistir filmes?',
        options: [
            {
                label: 'en (Inglês)',
                value: 'en',
                emoji: "🇪🇳"
            },
            {
                label: 'pt (Português)',
                value: 'pt',
                emoji: "🇵🇹"
            },
            {
                label: 'es (Espanhol)',
                value: 'es',
                emoji: "🇪🇸"
            },
            {
                label: 'fr (Francês)',
                value: 'fr',
                emoji: "🇫🇷"
            },
            {
                label: 'ja (Japonês)',
                value: 'ja',
                emoji: "🇯🇦"
            },
            {
                label: 'ko (Coreano)',
                value: 'ko',
                emoji: "🇰🇴"
            },
            {
                label: 'de (Alemão)',
                value: 'de',
                emoji: "🇩🇪"
            },
            {
                label: 'it (Italiano)',
                value: 'it',
                emoji: "🇮🇹"
            },
        ]
    },
    {
        text: 'Tem algum gênero que você NÃO gosta?',
        options: [
            {
                label: 'Terror',
                value: 'Horror',
                emoji: "🩻"
            },
            {
                label: 'Romance',
                value: 'Romance',
                emoji: "💘"
            },
            {
                label: 'Guerra',
                value: 'War',
                emoji: "🪖"
            },
            {
                label: 'Ocidental',
                value: 'Western',
                emoji: "🎴"
            },
            {
                label: 'Musical',
                value: 'Musical',
                emoji: "🎵"
            },
            {
                label: 'Documentário',
                value: 'Documentary',
                emoji: "🗃️"
            },
            {
                label: 'Animação',
                value: 'Animation',
                emoji: "🧸"
            },
        ]
    },
    {
        text: 'Qual a nota mínima aceitável para você?',
        options: [
            {
                label: '5.0',
                value: '5.0',
                emoji: "5️⃣"
            },
            {
                label: '6.0',
                value: '6.0',
                emoji: "6️⃣"
            },
            {
                label: '7.0',
                value: '7.0',
                emoji: "7️⃣"
            },
            {
                label: '8.0',
                value: '8.0',
                emoji: "8️⃣"
            },
            {
                label: '9.0',
                value: '9.0',
                emoji: "9️⃣"
            },
        ]
    }
];

async function importQuestions() {
    try {
        console.log('❇️  Iniciando importação de questões...');

        // Conectar ao banco
        await database.authenticate();
        console.log('✅ Conectado ao banco de dados');

        // Sincronizar tabela
        await Questions.sync({ force: false });
        console.log('✅ Tabela questions pronta');

        // Limpar tabela se já houver dados
        const existingCount = await Questions.count();
        if (existingCount > 0) {
            console.log(`⚠️  Já existem ${existingCount} questões no banco. Limpando...`);
            await Questions.destroy({ where: {}, truncate: true });
            console.log('✅ Banco limpo');
        }

        // Inserir dados
        const formattedQuestions = questionsData.map(q => ({
            id: uuidv4(),
            text: q.text,
            options: q.options,
            createdAt: new Date(),
            updatedAt: new Date()
        }));

        await Questions.bulkCreate(formattedQuestions, { validate: true });
        console.log(`✅ Importação concluída! Total: ${formattedQuestions.length} questões`);

    } catch (error) {
        console.error('❌ Erro durante importação:', error);
        console.error(error.stack);
        process.exit(1);
    } finally {
        await database.close();
        console.log('👋 Conexão fechada');
        process.exit(0);
    }
}

// Executar importação
importQuestions();
