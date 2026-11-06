<script lang="ts">
  import logo from "#lib/assets/logo.svg";
  import * as m from "#lib/paraglide/messages.js";
</script>

<!-- Replacing src/lib/assets/logo.svg is the only change needed to swap the logo. -->
<img src={logo} alt={m.nav_home()} class="h-12 w-auto" width="64" height="64" />
