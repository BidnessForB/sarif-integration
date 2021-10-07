import * as core from "@actions/core"
import * as glob from "@actions/glob"
import scanner from "./scanner"

const main = async () => {
  try {
    const globber = await glob.create(`${process.env.GITHUB_WORKSPACE}/evaluations/**/**/evaluation_*.json`)
    const [scanResult] = await globber.glob()

    if (!scanResult) {
      core.info(`No scan results found!`)
    } else {
      scanner(
        scanResult,
        core.getInput("dockerfile_name"),
        core.getInput("projectroot"),
        core.getInput("outputlocation"),
      )
    }
  } catch (e) {
    console.log(`Failed to run conversion! \n\n${(e as any).message}`)
    process.exit(1)
  }

}

main()
