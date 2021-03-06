import React from "react";
import Timecode from "../../helpers/timecode";
import PropertyWithTitleContent from "../atoms/PropertyWithTitleContent";
import SimplePropertyContent from "../atoms/SimplePropertyContent";
import { Link } from "gatsby";
import { PropertyDataInterface } from "../../interfaces/PropertyDataInterface";
import AttributeLink from "../atoms/AttributeLink";

const Property = ({data}) => {

  const blank:string = 'no data';
  const noValueBack:string = 'NA';

  /**
   * @param data
   */
  function  getType(data:PropertyDataInterface):string {
    let type:string = 'default';

    if (typeof data.type !== 'undefined') {
      type = data.type;
    }
    return type;
  }

  function displayDefault(content:any):any {
    if (content === noValueBack) {
      return blank;
    }

    return content;
  }

  /**
   * @param data
   */
  function displayAttribute(data:PropertyDataInterface):Object|string {
    // if there is no result
    if (data.content === noValueBack) {
      return blank;
    }
    return <Link to={'/'+data.model+'/'+data.uuid}>{data.content}</Link>
  }

  /**
   * @param timecode
   */
  function displayTimeCode(timecode:number):string {
    return Timecode.convert(timecode);
  }

  /**
   * @param data
   */
  function getContentList(data:PropertyDataInterface):any[]
  {
    let content = [];
    if (data.content !== 'undefined') {
      content = data.content;
    }
    else {
      content = [];
    }

    return content;
  }

  /**
   * @param data
   */
  function displayList(data:PropertyDataInterface):any {
    let response = blank;
    const list = getContentList(data);

    let property = '';
    if (typeof data.options !== 'undefined' && typeof data.options.listPropertyTitle !== 'undefined') {
      property = data.options.listPropertyTitle;
    }

    if (list.length > 0) {
      response = '';
      list.map((item, index:number) => {
        if (index === list.length-1) {
          // if there is no property, we don't need to use it (example: for person, we need to get person.fullname but for censorship we directly use the value of the censorship)
          (property)? response = response+item[property] :response = response+item;
        }
        else {
          (property)? response = response+item[property]+', ' :response = response+item+', ';
        }
      });
    }
    return response;
  }

  function displayAttributeList(data:PropertyDataInterface):any {
    let list = data.content;
    let property = '';
    if (typeof data.options !== 'undefined' && typeof data.options.listPropertyTitle !== 'undefined') {
      property = data.options.listPropertyTitle;
    }

    let model = data.model;

    if (list.length > 0) {
      let response = [];

      list.map((item, index:number) => {
        if (index === list.length-1) {
          // if there is no property, we don't need to use it (example: for person, we need to get person.fullname but for censorship we directly use the value of the censorship )
          (property)? response.push(<AttributeLink key={item.uuid} uuid={item.uuid} content={item[property]} model={model} />) :response.push(<span><AttributeLink uuid={data.uuid} content={item} model={model} /></span>);
        }
        else {
          (property)? response.push(<span><AttributeLink key={item.uuid} uuid={item.uuid} content={item[property]} model={model} /> , </span>) :response.push(<span><AttributeLink uuid={data.uuid} content={item} model={model} /> , </span>);
        }
      });

      return response;
    }

    return blank;
  }

  /**
   * @param data
   */
  function displayCategory(data:PropertyDataInterface):object {
    return <Link to={'/categories#'+data.uuid}>{data.content}</Link>;
  }

  function displayViaf(data:PropertyDataInterface): object|string {
    let viaf = blank;

    if(data.content !== 'undefined' && data.content !== noValueBack && data.content !== 'blank') {
      return (<Link to={'https://www.wikidata.org/wiki/'+data.content}>{'wikidata.org/wiki/'+data.content}</Link>);
    }

    return viaf;
  }

  /**
   * Called by displayList, we select the content to display : list, timecode, attribute
   * @param data
   */
  function displayContent(data:PropertyDataInterface):any {
    // get type
    const type = getType(data);
    const content = data.content;

    switch(type) {
      case 'list':
        return displayList(data);
      case 'timecode':
        return displayTimeCode(content);
      case 'attribute':
        return displayAttribute(data);
      case 'attributeList':
        return displayAttributeList(data);
      case 'category':
        return displayCategory(data);
      case 'viaf':
        return displayViaf(data);
      default:
        return displayDefault(content);
    }
  }

  // first function to display a Property and select if we display or not the title
  /**
   * @param data
   */
  function displayProperty(data:PropertyDataInterface) {
    if (typeof data.title !== 'undefined') {
      return <PropertyWithTitleContent title={data.title} content={displayContent(data)} />
    }
    return <SimplePropertyContent content={displayContent(data)} />
  }

  return (
    displayProperty(data)
  )}

export default Property;
