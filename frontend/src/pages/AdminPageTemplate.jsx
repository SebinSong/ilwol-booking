import React from 'react'
import { classNames as cn } from '@utils'
import { useSelector } from 'react-redux'
import Container from '@components/container/Container'
import { Navigate } from 'react-router-dom'

import { isAdminAuthenticated } from '@store/features/authDetailsSlice.js'

import './AdminPageTemplate.scss'

export default function AdminPageTemplate ({
  classes = '',
  children = null
}) {
  const isAdmin = useSelector(isAdminAuthenticated)

  if (isAdmin) {
    return (
      <Container classes={cn('l-page', 'admin-page-template', classes)}>
        {children}
      </Container>
    )
  } else {
    return <Navigate to={`/admin-login`} replace={true} />
  }
}
