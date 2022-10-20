const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const CommentType = require('./commentType');

const DocType = new GraphQLObjectType({
    name: 'Doc',
    description: 'This represents a doc',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        comments: { type: new GraphQLList(CommentType) },
    })
});

module.exports = DocType;
