'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const questions = [
      {
        text: 'Como você está se sentindo hoje?',
        options: JSON.stringify([
          'Animado (Action, Adventure)',
          'Pensativo (Drama, Mystery)',
          'Empolgado (Science Fiction, Thriller)',
          'Romântico (Romance, Comedy)',
          'Assustado (Horror)',
          'Curioso (Documentary, History)'
        ]),
       
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        text: 'Quais gêneros você mais gosta?',
        options: JSON.stringify([
          'Action',
          'Adventure',
          'Comedy',
          'Drama',
          'Horror',
          'Romance',
          'Science Fiction',
          'Thriller',
          'Fantasy',
          'Mystery',
          'Animation',
          'Crime'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        text: 'Em quais idiomas você prefere assistir filmes?',
        options: JSON.stringify([
          'en (Inglês)',
          'pt (Português)',
          'es (Espanhol)',
          'fr (Francês)',
          'ja (Japonês)',
          'ko (Coreano)',
          'de (Alemão)',
          'it (Italiano)'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        text: 'Tem algum gênero que você NÃO gosta?',
        options: JSON.stringify([
          'Horror',
          'Romance',
          'War',
          'Western',
          'Musical',
          'Documentary',
          'Animation'
        ]),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        text: 'Qual a nota mínima aceitável para você?',
        options: JSON.stringify(['5.0', '6.0', '7.0', '8.0', '9.0']),
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('questions', questions, {});
  },

  async down(queryInterface, Sequelize) {
    // await queryInterface.bulkDelete('questions', null, {});
  }
};
