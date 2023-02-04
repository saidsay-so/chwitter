import { Trans } from "@lingui/macro";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>
        <Trans>Vous êtes dans une zone de non-droit !</Trans>
      </h1>
      <h3>
        <Trans>La page demandée n'a pas été trouvée</Trans>
      </h3>
      <img src="/logo.svg" />
    </div>
  );
}
