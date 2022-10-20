const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const CommentType = new GraphQLObjectType({
    name: 'Comment',
    description: 'This represents a comment',
    fields: () => ({
        user: { type: GraphQLString },
        commentNum: { type: GraphQLString },
        comment: { type: GraphQLString },
    })
});

module.exports = CommentType;
