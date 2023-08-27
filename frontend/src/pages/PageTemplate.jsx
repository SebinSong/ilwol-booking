import React from 'react'
import { classNames as cn } from '@utils'
import Container from '@components/container/Container'

import './PageTemplate.scss'

export default function PageTemplate ({ classes, children = null }) {
  return (
    <Container classes={cn('l-page', 'page-template', classes)}>
      {children}
    </Container>
  )
}
