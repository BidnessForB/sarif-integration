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
      core.info(`Running scanning process...`)
      scanner(
        scanResult,
        core.getInput("dockerfile_name"),
        core.getInput("projectroot"),
        core.getInput("outputlocation"),
      )
    }
  } catch (e) {
    core.setFailed(`Failed to run conversion! \n\n${(e as any).message}`)
  }
}

main()
