import React from 'react'

interface SectionProps {
  id?: string
  highlight?: string
  title?: string
  description?: string
  children?: React.ReactNode
}

const Section: React.FC<SectionProps> = ({ id, highlight, title, description, children }) => (
  <section id={id} className="py-20 bg-darker">
    <div className="container mx-auto px-4">
      {(highlight || title || description) && (
        <div className="text-center mb-16">
          {(highlight || title) && (
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              {highlight && <span className="text-primary">{highlight}</span>}
              {highlight && title ? ' ' : ''}
              {title}
            </h2>
          )}
          {description && (
            <p className="text-text-muted max-w-2xl mx-auto">{description}</p>
          )}
        </div>
      )}
      {children}
    </div>
  </section>
)

export default Section

