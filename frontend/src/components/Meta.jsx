import { Helmet } from 'react-helmet-async';

const Meta = ({ title, description, keywords }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
      <meta name='keyword' content={keywords} />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Bem vindos a Lineshop',
  description: 'Vendemos os melhores produtos a preços baixos',
  keywords: 'Hardwares na promoção',
};

export default Meta;
