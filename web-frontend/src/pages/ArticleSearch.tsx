import { Card, Row, Container, Col } from 'react-bootstrap';
import { Async, AsyncProps } from 'react-async';
import update from 'immutability-helper';
import { Section, Loader, BrandedComponentProps } from '@innexgo/common-react-components';
import ErrorMessage from '../components/ErrorMessage';
import ExternalLayout from '../components/ExternalLayout';

import { ArticleData, articleDataViewPublic } from '../utils/api';
import { unwrap } from '@innexgo/frontend-common';
import format from 'date-fns/format';

type Data = {
  articleData: ArticleData[],
}

const loadData = async (props: AsyncProps<Data>) => {
  const articleData =
    await articleDataViewPublic({})
      .then(unwrap);

  return {
    articleData,
  }
}


type ResourceCardProps = {
  title: string,
  subtitle: string,
  text: string,
  href: string
}

function ResourceCard(props: ResourceCardProps) {
  return (
    <a className="text-dark" href={props.href}>
      <Card className="h-100" style={{ width: '15rem' }}>
        <Card.Body>
          <Card.Title>{props.title}</Card.Title>
          <Card.Subtitle className="text-muted">{props.subtitle}</Card.Subtitle>
          <Card.Text>{props.text}</Card.Text>
        </Card.Body>
      </Card>
    </a>
  )
}




function ArticleSearch(props: BrandedComponentProps) {
  return <ExternalLayout branding={props.branding} fixed={false} transparentTop={true}>
    <Container fluid className="py-4 px-4">
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Section id="goalIntents" name="Articles">
            <Async promiseFn={loadData}>
              {({ setData }) => <>
                <Async.Pending><Loader /></Async.Pending>
                <Async.Rejected>
                  {e => <ErrorMessage error={e} />}
                </Async.Rejected>
                <Async.Fulfilled<Data>>
                  {d => d.articleData.map(a =>
                      <ResourceCard
                      title={a.title}
                      subtitle={"foo"}
                      text={`Updated ${format(a.creationTime, 'YYYY MM Do')}`}
                      href={`/article_view?articleId=${a.article.articleId}`}
                      />
                  )}
                </Async.Fulfilled>
              </>}
            </Async>
          </Section>
        </Col>
      </Row>
    </Container>
  </ExternalLayout>
}

export default ArticleSearch;
