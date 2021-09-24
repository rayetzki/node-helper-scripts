const { rename, rmdir, mkdir, access } = require('fs/promises');
const { join, parse } = require('path');
const decompress = require('decompress');
const decompressUnzip = require('decompress-unzip');

async function createTempDir(currentDirectory) {
    const { dir, name } = parse(currentDirectory);
    const tempDir = join(dir, name);
    await access(tempDir).then(() => cleanupTempDir(tempDir)).catch(() => mkdir(tempDir));
    return tempDir;
}

async function cleanupTempDir(tempDir) {
    return await rmdir(tempDir, { recursive: true });
}

async function unzipArchive(input, output) {
    const tempDir = await createTempDir(input);
    const allEntries = await decompress(input, tempDir, { plugins: [decompressUnzip()] });
    if (!allEntries?.length) throw new Error('Пустой архив');
    const files = allEntries.filter(dirent => dirent.type === 'file');
    for (const file of files) {
        const currentPath = join(tempDir, file.path);
        const newPath = join(output, parse(file.path).base);
        await rename(currentPath, newPath);
    }
    cleanupTempDir(tempDir);
}

try {
    const [,, directoryPath, outputPath] = process.argv;
    unzipArchive(directoryPath, outputPath);
} catch (error) {
    console.error(error);
    process.exit(1);
}