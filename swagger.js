
window.onload = function() {
  // Build a system
  let url = window.location.search.match(/url=([^&]+)/);
  if (url && url.length > 1) {
    url = decodeURIComponent(url[1]);
  } else {
    url = window.location.origin;
  }
  let options = {
  "swaggerDoc": {
    "openapi": "3.0.0",
    "paths": {
      "/api/Auth/register": {
        "post": {
          "operationId": "AuthController_register",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RegisterDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "summary": "Register a new user",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/Auth/login": {
        "post": {
          "operationId": "AuthController_login",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/LoginDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Login and receive JWT tokens",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/Auth/refresh": {
        "post": {
          "operationId": "AuthController_refresh",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RefreshTokenDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Refresh access token",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/Auth/logout": {
        "post": {
          "operationId": "AuthController_logout",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/RefreshTokenDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Logout (revoke refresh token)",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/Auth/forgot-password": {
        "post": {
          "operationId": "AuthController_forgotPassword",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ForgotPasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Request password reset email",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/Auth/reset-password": {
        "post": {
          "operationId": "AuthController_resetPassword",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/ResetPasswordDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "summary": "Reset password using token from email",
          "tags": [
            "Auth"
          ]
        }
      },
      "/api/User/me": {
        "get": {
          "operationId": "UsersController_getMe",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get current user profile (who am I)",
          "tags": [
            "User"
          ]
        }
      },
      "/api/User/directory": {
        "get": {
          "operationId": "UsersController_directory",
          "parameters": [
            {
              "name": "search",
              "required": false,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get all users (directory)",
          "tags": [
            "User"
          ]
        }
      },
      "/api/User/{id}": {
        "get": {
          "operationId": "UsersController_findOne",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get user by ID",
          "tags": [
            "User"
          ]
        },
        "patch": {
          "operationId": "UsersController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateUserDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Update user by ID",
          "tags": [
            "User"
          ]
        }
      },
      "/api/Profile/by-user/{userId}": {
        "get": {
          "operationId": "ProfilesController_findByUser",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get profile by user ID",
          "tags": [
            "Profile"
          ]
        }
      },
      "/api/Profile/{userId}/analytics": {
        "get": {
          "operationId": "ProfilesController_getAnalytics",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Get profile analytics",
          "tags": [
            "Profile"
          ]
        }
      },
      "/api/Profile": {
        "post": {
          "operationId": "ProfilesController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateProfileDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Create or upsert profile",
          "tags": [
            "Profile"
          ]
        }
      },
      "/api/Profile/{id}": {
        "put": {
          "operationId": "ProfilesController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateProfileDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "summary": "Update profile by ID",
          "tags": [
            "Profile"
          ]
        }
      },
      "/api/UserExperience/by-user/{userId}": {
        "get": {
          "operationId": "ExperienceController_findByUser",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserExperience"
          ]
        }
      },
      "/api/UserExperience": {
        "post": {
          "operationId": "ExperienceController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateExperienceDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserExperience"
          ]
        }
      },
      "/api/UserExperience/{id}": {
        "put": {
          "operationId": "ExperienceController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateExperienceDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserExperience"
          ]
        },
        "delete": {
          "operationId": "ExperienceController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserExperience"
          ]
        }
      },
      "/api/UserEducation/by-user/{userId}": {
        "get": {
          "operationId": "EducationController_findByUser",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserEducation"
          ]
        }
      },
      "/api/UserEducation": {
        "post": {
          "operationId": "EducationController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateEducationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserEducation"
          ]
        }
      },
      "/api/UserEducation/{id}": {
        "put": {
          "operationId": "EducationController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateEducationDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserEducation"
          ]
        },
        "delete": {
          "operationId": "EducationController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserEducation"
          ]
        }
      },
      "/api/Skill": {
        "get": {
          "operationId": "SkillController_findAll",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Skill"
          ]
        }
      },
      "/api/Skill/search": {
        "get": {
          "operationId": "SkillController_search",
          "parameters": [
            {
              "name": "name",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Skill"
          ]
        }
      },
      "/api/UserSkill/by-user/{userId}": {
        "get": {
          "operationId": "SkillsController_findByUser",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserSkill"
          ]
        }
      },
      "/api/UserSkill": {
        "post": {
          "operationId": "SkillsController_add",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/AddSkillDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserSkill"
          ]
        }
      },
      "/api/UserSkill/user/{userId}/skill/{skillId}": {
        "delete": {
          "operationId": "SkillsController_remove",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "skillId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "UserSkill"
          ]
        }
      },
      "/api/Language": {
        "get": {
          "operationId": "LanguagesController_findAll",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Language"
          ]
        }
      },
      "/api/ProfileLanguage/by-profile/{profileId}": {
        "get": {
          "operationId": "LanguagesController_findByProfile",
          "parameters": [
            {
              "name": "profileId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Language"
          ]
        }
      },
      "/api/ProfileLanguage": {
        "post": {
          "operationId": "LanguagesController_add",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Language"
          ]
        }
      },
      "/api/ProfileLanguage/{id}": {
        "put": {
          "operationId": "LanguagesController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Language"
          ]
        },
        "delete": {
          "operationId": "LanguagesController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Language"
          ]
        }
      },
      "/api/Post/feed": {
        "get": {
          "operationId": "PostsController_getFeed",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        }
      },
      "/api/Post": {
        "get": {
          "operationId": "PostsController_getAll",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        },
        "post": {
          "operationId": "PostsController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreatePostDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        }
      },
      "/api/Post/{id}": {
        "get": {
          "operationId": "PostsController_findOne",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        },
        "put": {
          "operationId": "PostsController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdatePostDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        },
        "delete": {
          "operationId": "PostsController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        }
      },
      "/api/Post/{postId}/like": {
        "post": {
          "operationId": "PostsController_toggleLike",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        }
      },
      "/api/Post/{postId}/repost": {
        "post": {
          "operationId": "PostsController_repost",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        }
      },
      "/api/Post/{postId}/comments": {
        "get": {
          "operationId": "PostsController_getComments",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        },
        "post": {
          "operationId": "PostsController_addComment",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateCommentDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        }
      },
      "/api/Post/{postId}/comments/{commentId}": {
        "delete": {
          "operationId": "PostsController_deleteComment",
          "parameters": [
            {
              "name": "postId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "commentId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Post"
          ]
        }
      },
      "/api/Notification/by-user/{userId}": {
        "get": {
          "operationId": "NotificationsController_findByUser",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Notification"
          ]
        }
      },
      "/api/Notification/paged": {
        "get": {
          "operationId": "NotificationsController_findPaged",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Notification"
          ]
        }
      },
      "/api/Notification/{id}/read": {
        "patch": {
          "operationId": "NotificationsController_markRead",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Notification"
          ]
        }
      },
      "/api/Notification/read-all": {
        "post": {
          "operationId": "NotificationsController_markAllRead",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Notification"
          ]
        }
      },
      "/api/Notification/{id}": {
        "delete": {
          "operationId": "NotificationsController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Notification"
          ]
        }
      },
      "/api/Connection/my": {
        "get": {
          "operationId": "ConnectionsController_findMy",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Connection"
          ]
        }
      },
      "/api/Connection/pending": {
        "get": {
          "operationId": "ConnectionsController_findPending",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Connection"
          ]
        }
      },
      "/api/Connection/all": {
        "get": {
          "operationId": "ConnectionsController_findAll",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Connection"
          ]
        }
      },
      "/api/Connection/send/{addresseeId}": {
        "post": {
          "operationId": "ConnectionsController_send",
          "parameters": [
            {
              "name": "addresseeId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Connection"
          ]
        }
      },
      "/api/Connection/{id}/respond": {
        "put": {
          "operationId": "ConnectionsController_respond",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Connection"
          ]
        }
      },
      "/api/Connection/{id}": {
        "delete": {
          "operationId": "ConnectionsController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Connection"
          ]
        }
      },
      "/api/Conversation": {
        "get": {
          "operationId": "ConversationsController_findAll",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Conversation"
          ]
        },
        "post": {
          "operationId": "ConversationsController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "otherUserId": {
                      "type": "number"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Conversation"
          ]
        }
      },
      "/api/Conversation/{id}": {
        "delete": {
          "operationId": "ConversationsController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Conversation"
          ]
        }
      },
      "/api/Message/by-conversation/{conversationId}": {
        "get": {
          "operationId": "MessagesController_findByConversation",
          "parameters": [
            {
              "name": "conversationId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Message"
          ]
        }
      },
      "/api/Message": {
        "post": {
          "operationId": "MessagesController_send",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Message"
          ]
        }
      },
      "/api/Message/{id}": {
        "delete": {
          "operationId": "MessagesController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Message"
          ]
        }
      },
      "/api/Job": {
        "get": {
          "operationId": "JobsController_findAll",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Job"
          ]
        },
        "post": {
          "operationId": "JobsController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateJobDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Job"
          ]
        }
      },
      "/api/Job/paged": {
        "get": {
          "operationId": "JobsController_findPaged",
          "parameters": [
            {
              "name": "title",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "location",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Job"
          ]
        }
      },
      "/api/Job/search": {
        "get": {
          "operationId": "JobsController_search",
          "parameters": [
            {
              "name": "title",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            },
            {
              "name": "location",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Job"
          ]
        }
      },
      "/api/Job/by-organization/{orgId}": {
        "get": {
          "operationId": "JobsController_findByOrg",
          "parameters": [
            {
              "name": "orgId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Job"
          ]
        }
      },
      "/api/Job/{id}": {
        "get": {
          "operationId": "JobsController_findOne",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Job"
          ]
        },
        "put": {
          "operationId": "JobsController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateJobDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Job"
          ]
        },
        "delete": {
          "operationId": "JobsController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Job"
          ]
        }
      },
      "/api/Organization": {
        "get": {
          "operationId": "OrganizationsController_findAll",
          "parameters": [
            {
              "name": "search",
              "required": true,
              "in": "query",
              "schema": {
                "type": "string"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Organization"
          ]
        },
        "post": {
          "operationId": "OrganizationsController_create",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/CreateOrganizationDto"
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Organization"
          ]
        }
      },
      "/api/Organization/mine": {
        "get": {
          "operationId": "OrganizationsController_findMine",
          "parameters": [],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Organization"
          ]
        }
      },
      "/api/Organization/{id}": {
        "get": {
          "operationId": "OrganizationsController_findOne",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Organization"
          ]
        },
        "put": {
          "operationId": "OrganizationsController_update",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "requestBody": {
            "required": true,
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/UpdateOrganizationDto"
                }
              }
            }
          },
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Organization"
          ]
        }
      },
      "/api/OrganizationMember/by-organization/{orgId}": {
        "get": {
          "operationId": "OrgMemberController_findByOrg",
          "parameters": [
            {
              "name": "orgId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "OrganizationMember"
          ]
        }
      },
      "/api/OrganizationMember": {
        "post": {
          "operationId": "OrgMemberController_sendRequest",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "OrganizationMember"
          ]
        }
      },
      "/api/OrganizationMember/{id}/respond": {
        "put": {
          "operationId": "OrgMemberController_respond",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "OrganizationMember"
          ]
        }
      },
      "/api/OrganizationMember/{id}": {
        "delete": {
          "operationId": "OrgMemberController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "OrganizationMember"
          ]
        }
      },
      "/api/JobApplication/by-user/{userId}": {
        "get": {
          "operationId": "JobApplicationsController_findByUser",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "JobApplication"
          ]
        }
      },
      "/api/JobApplication/by-job/{jobId}": {
        "get": {
          "operationId": "JobApplicationsController_findByJob",
          "parameters": [
            {
              "name": "jobId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "JobApplication"
          ]
        }
      },
      "/api/JobApplication/by-organization/{orgId}": {
        "get": {
          "operationId": "JobApplicationsController_findByOrganization",
          "parameters": [
            {
              "name": "orgId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "JobApplication"
          ]
        }
      },
      "/api/JobApplication": {
        "post": {
          "operationId": "JobApplicationsController_apply",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "JobApplication"
          ]
        }
      },
      "/api/JobApplication/{id}/status": {
        "patch": {
          "operationId": "JobApplicationsController_updateStatus",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "JobApplication"
          ]
        }
      },
      "/api/JobApplication/{id}": {
        "delete": {
          "operationId": "JobApplicationsController_remove",
          "parameters": [
            {
              "name": "id",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "204": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "JobApplication"
          ]
        }
      },
      "/api/JobMatching/recommended-jobs/{userId}": {
        "get": {
          "operationId": "JobMatchingController_getRecommended",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "JobMatching"
          ]
        }
      },
      "/api/JobMatching/match-explanation/{userId}/{jobId}": {
        "get": {
          "operationId": "JobMatchingController_getMatchExplanation",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "jobId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "JobMatching"
          ]
        }
      },
      "/api/Upload/photo": {
        "post": {
          "operationId": "UploadController_uploadPhoto",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "file": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Upload"
          ]
        }
      },
      "/api/Upload/cv": {
        "post": {
          "operationId": "UploadController_uploadCv",
          "parameters": [],
          "requestBody": {
            "required": true,
            "content": {
              "multipart/form-data": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "file": {
                      "type": "string",
                      "format": "binary"
                    }
                  }
                }
              }
            }
          },
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Upload"
          ]
        }
      },
      "/api/Ai/ask": {
        "post": {
          "operationId": "AiController_ask",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Ai"
          ]
        }
      },
      "/api/Ai/analyze-cv": {
        "post": {
          "operationId": "AiController_analyzeCv",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Ai"
          ]
        }
      },
      "/api/Ai/skill-gap/{userId}/{jobId}": {
        "get": {
          "operationId": "AiController_skillGap",
          "parameters": [
            {
              "name": "userId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            },
            {
              "name": "jobId",
              "required": true,
              "in": "path",
              "schema": {
                "type": "number"
              }
            }
          ],
          "responses": {
            "200": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Ai"
          ]
        }
      },
      "/api/Ai/improve-job": {
        "post": {
          "operationId": "AiController_improveJob",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Ai"
          ]
        }
      },
      "/api/Ai/draft-cover-letter": {
        "post": {
          "operationId": "AiController_draftCoverLetter",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Ai"
          ]
        }
      },
      "/api/Ai/draft-message": {
        "post": {
          "operationId": "AiController_draftMessage",
          "parameters": [],
          "responses": {
            "201": {
              "description": ""
            }
          },
          "security": [
            {
              "bearer": []
            }
          ],
          "tags": [
            "Ai"
          ]
        }
      }
    },
    "info": {
      "title": "AI-JOB API",
      "description": "LinkedIn-like professional network API",
      "version": "1.0",
      "contact": {}
    },
    "tags": [],
    "servers": [],
    "components": {
      "securitySchemes": {
        "bearer": {
          "scheme": "bearer",
          "bearerFormat": "JWT",
          "type": "http"
        }
      },
      "schemas": {
        "RegisterDto": {
          "type": "object",
          "properties": {
            "fullName": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "phoneNumber": {
              "type": "string"
            },
            "password": {
              "type": "string",
              "minLength": 6
            },
            "role": {
              "type": "string",
              "enum": [
                "Candidate",
                "Organization",
                "Admin"
              ]
            }
          },
          "required": [
            "fullName",
            "email",
            "password"
          ]
        },
        "LoginDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "password": {
              "type": "string"
            }
          },
          "required": [
            "email",
            "password"
          ]
        },
        "RefreshTokenDto": {
          "type": "object",
          "properties": {
            "refreshToken": {
              "type": "string"
            }
          },
          "required": [
            "refreshToken"
          ]
        },
        "ForgotPasswordDto": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string",
              "example": "user@example.com"
            }
          },
          "required": [
            "email"
          ]
        },
        "ResetPasswordDto": {
          "type": "object",
          "properties": {
            "token": {
              "type": "string",
              "description": "Token from reset email"
            },
            "newPassword": {
              "type": "string",
              "minLength": 6
            }
          },
          "required": [
            "token",
            "newPassword"
          ]
        },
        "UpdateUserDto": {
          "type": "object",
          "properties": {}
        },
        "CreateProfileDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "number"
            },
            "headline": {
              "type": "string"
            },
            "bio": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "avatarUrl": {
              "type": "string"
            },
            "bannerUrl": {
              "type": "string"
            },
            "website": {
              "type": "string"
            },
            "phone": {
              "type": "string"
            },
            "openToWork": {
              "type": "boolean"
            }
          }
        },
        "UpdateProfileDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "number"
            },
            "headline": {
              "type": "string"
            },
            "bio": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "avatarUrl": {
              "type": "string"
            },
            "bannerUrl": {
              "type": "string"
            },
            "website": {
              "type": "string"
            },
            "phone": {
              "type": "string"
            },
            "openToWork": {
              "type": "boolean"
            }
          }
        },
        "CreateExperienceDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "number"
            },
            "title": {
              "type": "string"
            },
            "company": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "isCurrent": {
              "type": "boolean"
            },
            "description": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "title",
            "company"
          ]
        },
        "UpdateExperienceDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "number"
            },
            "title": {
              "type": "string"
            },
            "company": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "isCurrent": {
              "type": "boolean"
            },
            "description": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "title",
            "company"
          ]
        },
        "CreateEducationDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "number"
            },
            "institution": {
              "type": "string"
            },
            "degree": {
              "type": "string"
            },
            "field": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "institution",
            "degree"
          ]
        },
        "UpdateEducationDto": {
          "type": "object",
          "properties": {
            "userId": {
              "type": "number"
            },
            "institution": {
              "type": "string"
            },
            "degree": {
              "type": "string"
            },
            "field": {
              "type": "string"
            },
            "startDate": {
              "type": "string"
            },
            "endDate": {
              "type": "string"
            },
            "description": {
              "type": "string"
            }
          },
          "required": [
            "userId",
            "institution",
            "degree"
          ]
        },
        "AddSkillDto": {
          "type": "object",
          "properties": {}
        },
        "CreatePostDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string"
            },
            "imageUrl": {
              "type": "string"
            },
            "organizationId": {
              "type": "number"
            }
          },
          "required": [
            "content"
          ]
        },
        "UpdatePostDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string"
            },
            "imageUrl": {
              "type": "string"
            }
          }
        },
        "CreateCommentDto": {
          "type": "object",
          "properties": {
            "content": {
              "type": "string"
            }
          },
          "required": [
            "content"
          ]
        },
        "CreateJobDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "employmentType": {
              "type": "string"
            },
            "experienceLevel": {
              "type": "string"
            },
            "salary": {
              "type": "string"
            },
            "organizationId": {
              "type": "number"
            }
          },
          "required": [
            "title",
            "description"
          ]
        },
        "UpdateJobDto": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "employmentType": {
              "type": "string"
            },
            "experienceLevel": {
              "type": "string"
            },
            "salary": {
              "type": "string"
            },
            "organizationId": {
              "type": "number"
            }
          },
          "required": [
            "title",
            "description"
          ]
        },
        "CreateOrganizationDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "industry": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "website": {
              "type": "string"
            },
            "logoUrl": {
              "type": "string"
            },
            "bannerUrl": {
              "type": "string"
            }
          }
        },
        "UpdateOrganizationDto": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "industry": {
              "type": "string"
            },
            "location": {
              "type": "string"
            },
            "website": {
              "type": "string"
            },
            "logoUrl": {
              "type": "string"
            },
            "bannerUrl": {
              "type": "string"
            }
          }
        }
      }
    }
  },
  "customOptions": {}
};
  url = options.swaggerUrl || url
  let urls = options.swaggerUrls
  let customOptions = options.customOptions
  let spec1 = options.swaggerDoc
  let swaggerOptions = {
    spec: spec1,
    url: url,
    urls: urls,
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  }
  for (let attrname in customOptions) {
    swaggerOptions[attrname] = customOptions[attrname];
  }
  let ui = SwaggerUIBundle(swaggerOptions)

  if (customOptions.initOAuth) {
    ui.initOAuth(customOptions.initOAuth)
  }

  if (customOptions.authAction) {
    ui.authActions.authorize(customOptions.authAction)
  }
  
  window.ui = ui
}
