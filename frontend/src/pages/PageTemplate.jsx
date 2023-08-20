import React from 'react'
import { classNames as cn } from '@utils'
import Container from '@components/container/Container'

export default function PageTemplate ({ classes, children = null }) {
  return (
    <Container classes={cn('l-page', classes)}>
      {children}
    </Container>
  )
}
