import graphene
import lojapp.schema
import pdv.schema

class Query(lojapp.schema.Query, pdv.schema.Query, graphene.ObjectType):
    pass


class Mutation(pdv.schema.Mutation, graphene.ObjectType):
    pass

schema = graphene.Schema(query=Query, mutation=Mutation)