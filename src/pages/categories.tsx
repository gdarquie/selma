import React, {useState} from "react";
import { graphql } from "gatsby";
import { Paper, Container, Typography, Grid, Box } from "@material-ui/core";
import { Link } from "gatsby"
import Layout from "../components/layout";
import "../styles/categoryPage.css";

const CategoriesPage = ({data}) =>  {
  const [categoriesState, setCategoriesState] = useState(data.mc3.categories.edges);
  const [modelsState, setModelsState] = useState(getModels(categoriesState));

  // get all distinct models type from categories = film, song, number
  function getModels(categoriesState: object[]): string[] {
    return  [...new Set(categoriesState.map(item => item.node.model))];
  }

  function getOrderedCategories() {
    // group all categories by models
    const orderedCategories = [];

    // alphabetically sort categories list
    categoriesState.sort(function(a, b){
      if(a.node.title < b.node.title) { return -1; }
      if(a.node.title > b.node.title) { return 1; }
      return 0;
    })

    modelsState.map(model => {
      categoriesState.map(({node}) => {
          if (node.model === model) {
            orderedCategories.push(node);
          }
      })
    })

    return orderedCategories;
  }

  function displayDescription(description) {
    if(description) {
      return (
        <Paper elevation={0}>
          <section className='category-section'>
            <h4 className='property-title'>Description</h4>
            <p>{description}</p>
          </section>
        </Paper>
      )
    }
  }

  function displayCategory(category) {
    return (
      <div key = {category.uuid} id={category.uuid}>
        <h3 className='category-title'>{category.title.charAt(0).toUpperCase() + category.title.slice(1)}</h3>
        {/*display category description if exists*/}
        {displayDescription(category.description)}
        <Paper elevation={0}>
          <section className='category-section'>
            <h4 className='property-title'>Attributes ({category.attributesCount} types)</h4>
            <ul>
              {category.attributes.map(attribute => (
                <li>{attribute.title} ({attribute.elementsCount})</li>
              ))}
            </ul>
          </section>
        </Paper>
        <p className="return-top-caption"><Link to={'/categories'}>return to top</Link></p>
      </div>
    )
  }

  function getCategoriesByModel(model:object, categoriesList:Array<string>):object[] {
    const modelCategoriesList = [];
    categoriesList.map(category => {
      if (category.model === model) {
        modelCategoriesList.push(category);
      }
    });

    return modelCategoriesList;
  }

  // get all the categories group by all the models
  function getResponseForAllCategoriesByModels(models:Array<any>, categoriesList:Array<string>):Array<any> {
    const response = [];
    models.map((model) => {
      const modelCategoriesList = getCategoriesByModel(model, categoriesList);

      response.push(<h2 className="model-title">{model}'s Categories</h2>);
      response.push(<hr/>);
      modelCategoriesList.map( category => {
        response.push(displayCategory(category));
      })
    })

    return response;
  }

  function displayCategories() {
    return getResponseForAllCategoriesByModels(modelsState, getOrderedCategories());
  }

  function displayMenuCategoriesByModel(model:string):Array<any> {
    const response = [<h2>{model.charAt(0).toUpperCase() + model.slice(1)}</h2>];
    categoriesState.map(({node}) => {
      if (node.model === model) {
        return (
          response.push(<p className='menu-list'>
            <Link
              to={`/categories#${node.uuid}`}
            >
              {node.title}
            </Link>
          </p>)
        )
      }
    });

    return response;
  }

  function displayMenu() {
    return (
      <Box display={{ xs: "none", md: "block" }} className="menu">
        {
          modelsState.map(model => {
            return (
              displayMenuCategoriesByModel(model)
            )
        })
      }
      </Box>
    );
  }

  return (
        <Layout>
            <Container className='container' maxWidth="md">
              <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={9}>
                  {displayCategories()}
                </Grid>
                <Grid item xs={12} sm={12} md={3}>
                  {displayMenu()}
                </Grid>
              </Grid>
            </Container>
        </Layout>
    );
};

export default CategoriesPage;

export const query = graphql`
  {
    mc3 {
      categories {
        edges {
          node {
            model
            title
            uuid
            description
            attributesCount
            attributes
          }
        }
      }
    }
  }
`;