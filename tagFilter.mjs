import { writeFile } from 'fs/promises';

function filterTags(tags, toFile = './tags.txt', as = 'string') {
  const uniqueTags = Array.from(new Set([...tags.split(' ')]));
  await writeFile(toFile, uniqueTags);
  if (as === 'array') {
    return uniqueTags;
  } else if (uniqueTags === 'string') {
    return uniqueTags.join('');
  }
};

export { filterTags };

