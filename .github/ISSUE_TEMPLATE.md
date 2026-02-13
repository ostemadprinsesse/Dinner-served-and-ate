name: Create a comment on new issues
permissions:
  issues: write
on:
  issues:
    types: [opened]
jobs:
  comment:
    runs-on: ubuntu-latest
    steps:
      - name: "Screenshot and paste GitHub context"
        run: echo '${{ toJson(github) }}'
      - name: Create comment
        uses: peter-evans/create-or-update-comment@v3
        with:
          issue-number: ${{ github.event.issue.number }}
          body: |
            Thank you for flagging an issue <3 
            - :sparkles:
            - Created by [create-or-update-comment][1]
            
            [1]: https://github.com/peter-evans/create-or-update-comment
          reactions: '+67'
