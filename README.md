# Resource Reservation Frontend

## Overview
Resource Reservation Frontend is the client-side application for the Resource Reservation system, built with Angular 21 and Angular Material. It allows anyone to browse available resources (meeting rooms, equipment, and shared spaces) and check real-time availability, while authenticated users can make and manage reservations. Admins get a full management panel to control resources, categories, users, and the entire reservation lifecycle.

> The backend REST API (ASP.NET Core 10) is available here: [Resource Reservation API](https://github.com/krzysztof-lech/resource-reservation-api)

## Technologies

- Angular 21 (standalone components, signals)
- Angular Material
- TypeScript
- RxJS
- Angular HTTP Client with JWT interceptor

## Features

- JWT authentication with automatic token handling and role decoding
- Role-based access control (User, Admin)
- Public browsing — anyone can view resources and check availability without logging in
- Interactive availability calendar with multi-slot selection for a single reservation
- Full reservation lifecycle: **Pending → Confirmed → Cancelled**
- Guest-to-login flow — unauthenticated users are redirected to log in only when confirming a reservation, then returned to their selection
- Admin panel:
  - Resource management (create, edit, delete, toggle availability)
  - Category management via an in-context dialog
  - User management, including role changes
  - Full reservation overview with status filtering and manual confirmation/cancellation
- Debounced search across resources and users
- Route guards protecting views based on authentication and role

## Project structure

```
src/
├── app/
│ ├── core/
│ │ ├── guards/ # auth.guard, admin.guard
│ │ ├── interceptors/ # JWT auth interceptor
│ │ ├── services/ # auth, resource, category, reservation, user
│ │ └── utils/ # shared error-message extraction
│ ├── features/
│ │ ├── auth/
│ │ │ └── login/
│ │ ├── resources/
│ │ │ ├── resource-list/ # public resource browsing
│ │ │ └── resource-detail/ # availability calendar & booking
│ │ ├── reservations/
│ │ │ └── my-reservations/ # logged-in user's own reservations
│ │ └── admin/
│ │ ├── admin.routes.ts # admin section routing (lazy-loaded)
│ │ ├── admin-resources/
│ │ ├── admin-resource-new/
│ │ ├── admin-resource-edit/
│ │ ├── admin-category-dialog/
│ │ ├── admin-users/
│ │ ├── admin-user-edit/
│ │ └── admin-reservations/
│ ├── models/ # TypeScript interfaces matching backend DTOs
│ ├── shared/
│ │ └── nav-bar/ # role-aware navigation, admin mode toggle
│ └── app.routes.ts
└── environments/
```
## Routing


| Path | Component | Access |
|---|---|---|
| `/login` | Login | Public |
| `/resources` | ResourceList | Public |
| `/resources/:id` | ResourceDetail | Public (login required to confirm a reservation) |
| `/reservations/my` | MyReservations | Authenticated |
| `/admin/resources` | AdminResources | Admin only |
| `/admin/resources/new` | AdminResourceNew | Admin only |
| `/admin/resources/:id/edit` | AdminResourceEdit | Admin only |
| `/admin/reservations` | AdminReservations | Admin only |
| `/admin/users` | AdminUsers | Admin only |
| `/admin/users/:id/edit` | AdminUserEdit | Admin only |

## Getting Started
### Prerequisites
- Node.js (v20.19+ recommended)
- Angular CLI 21

```bash
npm install -g @angular/cli
```

### Installation
```bash
# Clone the repository
git clone https://github.com/krzysztof-lech/resource-reservation-frontend.git
cd resource-reservation-frontend

# Install dependencies
npm install
```

### Configuration

The application expects the backend API to be running locally. Check `src/environments/environment.ts` and adjust the API URL if needed:

```typescript
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7174/api'
};
```

### Running the Application

```bash
npm start
```

The app will be available at http://localhost:4200.

## Related Repository

- 🔗 **[Resource Reservation API (Backend)](https://github.com/krzysztof-lech/resource-reservation-api)** — ASP.NET Core 10 REST API implementation