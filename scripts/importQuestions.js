import { v4 as uuidv4 } from 'uuid';
import { database } from '../src/config/database.js';
import { Questions } from '../src/models/Questions.js';

const questionsData = [
    {
        text: 'Como você está se sentindo hoje?',
        options: [
            'Animado (Action, Adventure)',
            'Pensativo (Drama, Mystery)',
            'Empolgado (Science Fiction, Thriller)',
            'Romântico (Romance, Comedy)',
            'Assustado (Horror)',
            'Curioso (Documentary, History)'
        ]
    },
    {
        text: 'Quais gêneros você mais gosta?',
        options: [
            'Action', 'Adventure', 'Comedy', 'Drama', 'Horror', 'Romance',
            'Science Fiction', 'Thriller', 'Fantasy', 'Mystery', 'Animation', 'Crime'
        ]
    },
    {
        text: 'Em quais idiomas você prefere assistir filmes?',
        options: [
            'en (Inglês)', 'pt (Português)', 'es (Espanhol)', 'fr (Francês)',
            'ja (Japonês)', 'ko (Coreano)', 'de (Alemão)', 'it (Italiano)'
        ]
    },
    {
        text: 'Tem algum gênero que você NÃO gosta?',
        options: [
            'Horror', 'Romance', 'War', 'Western', 'Musical', 'Documentary', 'Animation'
        ]
    },
    {
        text: 'Qual a nota mínima aceitável para você?',
        options: ['5.0', '6.0', '7.0', '8.0', '9.0']
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
