import { render } from "rx-vdom";
import { navigation } from "./navigation";
import { Router, DefaultLayout } from "mkdocs-ts";
import { setup } from "../auto-generated";

export const router = new Router({
  navigation,
});

document.body.appendChild(
  render(
    new DefaultLayout.Layout({
      router,
    })
  )
);
