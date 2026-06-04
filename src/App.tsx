import { memo } from 'react'
import Layout from './Layout/Layout'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Home,Jobs, Login, Register, CandidateFeed, ForgotPassword, ResetPassword, JobsCandidate, NetworkCandidate, MessagesCandidate, Candidates, Companies, ProfileCandidate, NotificationsCandidate, AICandidate, OrganizationFeed, OrganizationJobs, AIOrganization, OrganizationProfile, OrganizationNetwork, OrganizationMessages, OrganizationNotifications, NotFound } from './router/router';
import { ProtectedRoute } from './components/ProtectedRoute';

const App = memo(() => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/jobs",
          element: <Jobs />,
        },
        {
          path: "/candidates",
          element: <Candidates />,
        },
        {
          path: "/companies",
          element: <Companies />,
        },
        {
          element: <ProtectedRoute />, // Protect all candidate routes
          children: [
            {
              path: "/candidate",
              element: <CandidateFeed />,
            },
            {
              path: "/jobs-candidate",
              element: <JobsCandidate />,
            },
            {
              path: "/network-candidate",
              element: <NetworkCandidate />,
            },
            {
              path: "/messages-candidate",
              element: <MessagesCandidate />,
            },
            {
              path: "/profile-candidate",
              element: <ProfileCandidate />,
            },
            {
              path: "/notifications-candidate",
              element: <NotificationsCandidate />,
            },
            {
              path: "/ai-candidate",
              element: <AICandidate />,
            },
          ]
        },
        {
          element: <ProtectedRoute />, // Protect all organization routes
          children: [
            {
              path: "/company-feed",
              element: <OrganizationFeed />,
            },
            {
              path: "/company-jobs",
              element: <OrganizationJobs />,
            },
            {
              path: "/ai-company",
              element: <AIOrganization />,
            },
            {
              path: "/company-profile",
              element: <OrganizationProfile />,
            },
            {
              path: "/company-network",
              element: <OrganizationNetwork />,
            },
            {
              path: "/company-messages",
              element: <OrganizationMessages />,
            },
            {
              path: "/notifications-company",
              element: <OrganizationNotifications />,
            },
          ]
        },
        {
          path: "*",
          element: <NotFound />
        }
      ],
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "/reset-password",
      element: <ResetPassword />
    }

  ]);
  return <RouterProvider router={router} />
})

export default App