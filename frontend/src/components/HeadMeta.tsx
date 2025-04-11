function HeadMeta({ title, description }: { title: string, description: string }) {
    return (
      <>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
      </>
    );
  }

export default HeadMeta