# DO NOT USE !

This is a test repository i'm using to train me with Typescript. In fact it is working but I'm pretty sure this is not the best code you will ever see !

## What Filigrane does ?

Filigrane is a small service that will help you add _watermark_ on your file in order to avoid anyone else to reuse it for another purpose. In fact there is other service that does it. For example, french gouvernment offer [FiligraneFacile](https://filigrane.beta.gouv.fr/) and to be honest right now this is the service that we use. But my goal is to create a browser extension in order to automatically apply the watermark when you submit a file to a form.

If it work as expexted, the user will have nothing to do, just fill a form online and the extension add a watermark and replace your file by the "protected" one.

## User stories

- As a user of the website I want to
  - [x] upload a file and add a filigrane to it.
  - [x] preview the file with the filigrane
  - [x] download the protected file
  - [ ] revert the protection and retrieve the original file
- As a user of the extension I want to
  - [ ] see all the files uploaded in the current tab
  - [ ] add watermark to the files in the current tab
  - [ ] automatically do the process for me
  - [ ] revert the changes on a specific file

## Technical backlog

This is a list of technical tasks I want to adress if I have time.

- [ ] Create a chrome extension that is using the same code as the service
- [ ] Add some tests
- [ ] Remove the dependency with FiligraneFacile, do all the process in local
- [ ] Keep the file format as the original one
- [ ] Remove webpack
