# NodeJS ExpressJS 

# Important command

npm init <br />
npm i --save express express-session body-parser ejs mongodb  <br />
npm i --save-dev nodemon <br />
nodemon app.js <br />


# Ejs Template Engine 

<%= %> <br />

# query {
#   manager{
#     id
#     name
#     email
#   }
# }



# mutation {
#   addManager(name: "Sanjay Manager", email: "bob@example.com") {
#     id
#     name
#     email
#   }
# }
# ##################################

# query {
#   manager(id: "1") {
#     id
#     name
#     email
#     subManagers {
#       id
#       name
#       subManagers {
#         id
#         name
#         subManagers {
#           id
#           name
#           subManagers {
#             id
#             name
#           	subManagers {
#             	id
#             	name
#             }
#           }
#         }
#       }
#     }
#   }
# }

# ##############################################

# {
#   allManagers {
#     id
#     name
#     email
#     subManagers {
#       id
#     }
#   }
# }

# ########################################3

# mutation {
#   addManager(name: "New Junior Manager", email: "junior@example.com", parentId: "6") {
#     id
#     name
#     email
#   }
# }