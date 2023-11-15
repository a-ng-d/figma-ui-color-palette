export const notionOptions = {
  Authorization: `Bearer ${process.env.REACT_APP_NOTION_API_KEY}`,
  Accept: 'application/json',
  'Notion-Version': '2022-06-28',
  'content-type': 'application/json',
}
