const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
} = require('graphql');

const DocType = require("./docType.js");
// const AuthType = require("./auth.js");

const docModel = require('../models/docModel');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        doc: {
            type: DocType,
            description: 'A single doc',
            args: {
                _id: { type: GraphQLString }
            },
            resolve: async function (parent, args) {
                const result = await docModel.findDoc(args);
                // modellen själv kommer leta i args._id!

                return result;
            }
        },
        docs: {
            type: new GraphQLList(DocType),
            description: 'List of all docs',
            resolve: async function () {
                return await docModel.getAllDocs();
            }
        },
        // teacher: {
        //     type: TeacherType,
        //     description: 'A single teacher',
        //     args: {
        //         acronym: { type: GraphQLString }
        //     },
        //     resolve: async function (parent, args) {
        //         let teachers = await getPeople("teachers");

        //         return teachers.find(teacher => teacher.acronym === args.acronym)
        //     }
        // },
        // teachers: {
        //     type: GraphQLList(TeacherType),
        //     description: 'List of teachers',
        //     resolve: async function () {
        //         return await getPeople("teachers");
        //     }
        // },
        // students: {
        //     type: GraphQLList(StudentType),
        //     description: 'List of students',
        //     resolve: async function () {
        //         return await getPeople("students");
        //     }
        // }
    })
});

// async function getPeople(entity) {
//     let courseArray = await courses.getAll();
//     let people = [];
//     let acronyms = [];
//     courseArray.forEach(function (course) {
//         course[entity].forEach(function (person) {
//             if (acronyms.indexOf(person.acronym) === -1) {
//                 people.push(person);
//                 acronyms.push(person.acronym);
//             }
//         });
//     });

//     return people;
// }

module.exports = RootQueryType;
